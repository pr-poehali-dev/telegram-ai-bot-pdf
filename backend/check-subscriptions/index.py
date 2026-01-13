import json
import os
import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    """Проверка истечения подписок и отправка уведомлений (запускается ежедневно)"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        now = datetime.utcnow()
        
        # 1. Находим истекшие подписки и меняем статус
        cur.execute("""
            UPDATE t_p56134400_telegram_ai_bot_pdf.tenants
            SET subscription_status = 'expired', updated_at = NOW()
            WHERE subscription_status = 'active' 
            AND subscription_end_date < %s
            RETURNING id, name, owner_email, subscription_end_date
        """, (now,))
        
        expired_tenants = cur.fetchall()
        
        # Обновляем статус пользователей истекших тенантов
        for tenant in expired_tenants:
            tenant_id = tenant[0]
            cur.execute("""
                UPDATE t_p56134400_telegram_ai_bot_pdf.admin_users
                SET subscription_status = 'expired', is_active = false
                WHERE tenant_id = %s
            """, (tenant_id,))
        
        conn.commit()
        
        # 2. Находим подписки истекающие через 7, 3, 1 день для отправки уведомлений
        notification_dates = [
            (7, 'warning_7days'),
            (3, 'warning_3days'),
            (1, 'warning_1day')
        ]
        
        notifications_sent = []
        
        for days, notification_type in notification_dates:
            target_date_start = now + timedelta(days=days)
            target_date_end = target_date_start + timedelta(hours=24)
            
            cur.execute("""
                SELECT t.id, t.name, t.owner_email, t.subscription_end_date, 
                       tp.renewal_price, tp.name as tariff_name
                FROM t_p56134400_telegram_ai_bot_pdf.tenants t
                LEFT JOIN t_p56134400_telegram_ai_bot_pdf.tariff_plans tp ON tp.id = t.tariff_id
                WHERE t.subscription_status = 'active'
                AND t.subscription_end_date >= %s
                AND t.subscription_end_date < %s
                AND t.owner_email IS NOT NULL
            """, (target_date_start, target_date_end))
            
            tenants_to_notify = cur.fetchall()
            
            for tenant_data in tenants_to_notify:
                tenant_id, tenant_name, owner_email, end_date, renewal_price, tariff_name = tenant_data
                
                # Отправляем уведомление
                email_sent = send_expiration_warning(
                    to_email=owner_email,
                    tenant_name=tenant_name,
                    tenant_id=tenant_id,
                    days_left=days,
                    renewal_price=float(renewal_price) if renewal_price else 0,
                    tariff_name=tariff_name or 'Базовый',
                    cur=cur
                )
                
                if email_sent:
                    notifications_sent.append({
                        'tenant_id': tenant_id,
                        'email': owner_email,
                        'days_left': days,
                        'type': notification_type
                    })
        
        cur.close()
        conn.close()
        
        result = {
            'ok': True,
            'expired_count': len(expired_tenants),
            'notifications_sent': len(notifications_sent),
            'expired_tenants': [{'id': t[0], 'name': t[1], 'email': t[2]} for t in expired_tenants],
            'notifications': notifications_sent
        }
        
        print(f'Subscription check completed: {json.dumps(result)}')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result),
            'isBase64Encoded': False
        }

    except Exception as e:
        print(f'Error checking subscriptions: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }


def send_expiration_warning(to_email: str, tenant_name: str, tenant_id: int, days_left: int, 
                           renewal_price: float, tariff_name: str, cur) -> bool:
    """Отправка предупреждения об истечении подписки"""
    try:
        # Получаем SMTP настройки из БД
        cur.execute("""
            SELECT setting_key, setting_value 
            FROM t_p56134400_telegram_ai_bot_pdf.default_settings
            WHERE setting_key IN ('smtp_host', 'smtp_port', 'smtp_user', 'smtp_password')
        """)
        settings_rows = cur.fetchall()
        settings = {row[0]: row[1] for row in settings_rows}
        
        smtp_host = settings.get('smtp_host', '').strip()
        smtp_port = int(settings.get('smtp_port', 465))
        smtp_user = settings.get('smtp_user', '').strip()
        smtp_password = settings.get('smtp_password', '').strip()
        
        if not all([smtp_host, smtp_user, smtp_password]):
            print('SMTP настройки не полностью заполнены')
            return False
        
        # Формируем текст письма
        renewal_url = f"https://your-domain.com/content-editor?tenant_id={tenant_id}"
        
        if days_left == 7:
            subject = f'Подписка истекает через {days_left} дней'
            message = f"""Здравствуйте!

Напоминаем, что ваша подписка на тариф "{tariff_name}" для проекта "{tenant_name}" истекает через {days_left} дней.

Стоимость продления: {renewal_price:.2f} ₽/месяц

Чтобы продлить подписку и не потерять доступ к вашему AI-консьержу, перейдите в личный кабинет:
{renewal_url}

С уважением,
Команда поддержки"""
        elif days_left == 3:
            subject = f'⚠️ Подписка истекает через {days_left} дня!'
            message = f"""Здравствуйте!

Внимание! Ваша подписка на тариф "{tariff_name}" для проекта "{tenant_name}" истекает через {days_left} дня.

Стоимость продления: {renewal_price:.2f} ₽/месяц

Продлите подписку прямо сейчас, чтобы избежать прерывания работы:
{renewal_url}

С уважением,
Команда поддержки"""
        else:  # 1 день
            subject = f'🚨 Подписка истекает завтра!'
            message = f"""Здравствуйте!

Критически важно! Ваша подписка на тариф "{tariff_name}" для проекта "{tenant_name}" истекает ЗАВТРА.

После истечения подписки доступ к AI-консьержу будет заблокирован.

Стоимость продления: {renewal_price:.2f} ₽/месяц

Продлите подписку немедленно:
{renewal_url}

С уважением,
Команда поддержки"""
        
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(message, 'plain', 'utf-8'))
        
        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
        
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        
        print(f'Expiration warning email sent to {to_email} ({days_left} days left)')
        return True
    except Exception as e:
        print(f'Error sending expiration warning email: {str(e)}')
        return False
