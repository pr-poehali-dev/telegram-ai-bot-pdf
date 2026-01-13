import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def handler(event: dict, context) -> dict:
    """Тестовая отправка email-шаблона на указанный адрес"""
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }

    try:
        body_str = event.get('body', '{}')
        if not body_str or body_str == '':
            body_str = '{}'
        
        body = json.loads(body_str)
        
        test_email = body.get('test_email', '')
        template_html = body.get('template_html', '')
        template_type = body.get('template_type', 'test')
        
        if not test_email:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': False, 'error': 'Email для тестовой отправки обязателен'}),
                'isBase64Encoded': False
            }
        
        if not template_html:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': False, 'error': 'HTML шаблон обязателен'}),
                'isBase64Encoded': False
            }
        
        smtp_host = os.environ.get('EMAIL_SMTP_HOST', '')
        smtp_port = int(os.environ.get('EMAIL_SMTP_PORT', '465'))
        smtp_user = os.environ.get('EMAIL_SMTP_USER', '')
        smtp_password = os.environ.get('EMAIL_SMTP_PASSWORD', '')
        
        if not all([smtp_host, smtp_user, smtp_password]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': False, 'error': 'SMTP настройки не заданы'}),
                'isBase64Encoded': False
            }
        
        # Подставляем тестовые данные в шаблон
        test_data = {
            'name': 'Тестовый Клиент',
            'email': test_email,
            'tariff': 'Тариф Бизнес (Тестовый)',
            'amount': 15000,
            'tenant_slug': 'test-hotel-demo',
            'username': 'test_hotel_user',
            'password': 'TestPassword123',
            'login_url': 'https://ai-ru.ru/content-editor?tenant_id=999',
            'phone': '+7 (999) 123-45-67',
            'payment_id': 'test-payment-12345'
        }
        
        # Форматируем шаблон
        try:
            formatted_html = template_html.format(**test_data)
        except KeyError as e:
            formatted_html = template_html
        
        # Определяем тему письма
        subject_map = {
            'order_customer': 'Тест: Подтверждение заказа AI-консультанта',
            'order_admin': 'Тест: Новый заказ в системе',
            'welcome': 'Тест: Добро пожаловать!'
        }
        subject = subject_map.get(template_type, 'Тестовое письмо из AI-консультант')
        
        # Отправляем email
        send_email(smtp_host, smtp_port, smtp_user, smtp_password, test_email, subject, formatted_html)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'message': f'Тестовое письмо отправлено на {test_email}'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        print(f'Error sending test email: {e}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': str(e)}),
            'isBase64Encoded': False
        }

def send_email(host: str, port: int, user: str, password: str, to_email: str, subject: str, html_body: str):
    """Отправка email через SMTP"""
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = user
    msg['To'] = to_email
    
    html_part = MIMEText(html_body, 'html', 'utf-8')
    msg.attach(html_part)
    
    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=10) as server:
            server.login(user, password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=10) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)
