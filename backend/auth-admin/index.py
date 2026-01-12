import json
import os
import hashlib
import psycopg2
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    """Авторизация администратора с защитой от брутфорса"""
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }

    try:
        body = json.loads(event.get('body', '{}'))
        password = body.get('password', '')
        ip_address = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')

        if not password:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'password required'}),
                'isBase64Encoded': False
            }

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()

        cur.execute("""
            CREATE TABLE IF NOT EXISTS t_p56134400_telegram_ai_bot_pdf.login_attempts (
                id SERIAL PRIMARY KEY,
                ip_address VARCHAR(50),
                attempt_time TIMESTAMP DEFAULT NOW(),
                success BOOLEAN
            )
        """)
        conn.commit()

        lockout_duration = timedelta(minutes=15)
        max_attempts = 5
        attempt_window = timedelta(minutes=10)

        cur.execute("""
            SELECT COUNT(*) 
            FROM t_p56134400_telegram_ai_bot_pdf.login_attempts 
            WHERE ip_address = %s 
            AND success = false 
            AND attempt_time > %s
        """, (ip_address, datetime.now() - attempt_window))
        
        failed_attempts = cur.fetchone()[0]

        if failed_attempts >= max_attempts:
            cur.execute("""
                SELECT attempt_time 
                FROM t_p56134400_telegram_ai_bot_pdf.login_attempts 
                WHERE ip_address = %s 
                AND success = false 
                ORDER BY attempt_time DESC 
                LIMIT 1
            """, (ip_address,))
            
            last_attempt = cur.fetchone()
            if last_attempt:
                time_since_last = datetime.now() - last_attempt[0]
                if time_since_last < lockout_duration:
                    remaining_time = int((lockout_duration - time_since_last).total_seconds() / 60)
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 429,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'error': f'Слишком много попыток входа. Попробуйте через {remaining_time} мин.',
                            'remainingMinutes': remaining_time
                        }),
                        'isBase64Encoded': False
                    }

        admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        admin_hash = hashlib.sha256(admin_password.encode()).hexdigest()

        if password_hash == admin_hash:
            cur.execute("""
                INSERT INTO t_p56134400_telegram_ai_bot_pdf.login_attempts (ip_address, success)
                VALUES (%s, true)
            """, (ip_address,))
            
            cur.execute("""
                DELETE FROM t_p56134400_telegram_ai_bot_pdf.login_attempts 
                WHERE ip_address = %s AND success = false
            """, (ip_address,))
            
            conn.commit()
            cur.close()
            conn.close()

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'token': password_hash
                }),
                'isBase64Encoded': False
            }
        else:
            cur.execute("""
                INSERT INTO t_p56134400_telegram_ai_bot_pdf.login_attempts (ip_address, success)
                VALUES (%s, false)
            """, (ip_address,))
            conn.commit()

            cur.execute("""
                SELECT COUNT(*) 
                FROM t_p56134400_telegram_ai_bot_pdf.login_attempts 
                WHERE ip_address = %s 
                AND success = false 
                AND attempt_time > %s
            """, (ip_address, datetime.now() - attempt_window))
            
            current_failed = cur.fetchone()[0]
            attempts_left = max_attempts - current_failed

            cur.close()
            conn.close()

            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'error': 'Неверный пароль',
                    'attemptsLeft': max(0, attempts_left)
                }),
                'isBase64Encoded': False
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }