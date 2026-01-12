import json
import os
import hashlib
import psycopg2
from typing import Optional

def handler(event: dict, context) -> dict:
    """Управление администраторами: CRUD операции с учётными записями"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }

    try:
        # TODO: Добавить проверку, что пользователь - super_admin
        # Пока закомментировано, т.к. нужно интегрировать auth_middleware
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()

        if method == 'GET':
            # Получить список всех администраторов
            cur.execute("""
                SELECT 
                    au.id, 
                    au.username, 
                    au.email, 
                    au.role, 
                    au.tenant_id, 
                    t.name as tenant_name,
                    au.is_active, 
                    au.last_login_at, 
                    au.created_at
                FROM t_p56134400_telegram_ai_bot_pdf.admin_users au
                LEFT JOIN t_p56134400_telegram_ai_bot_pdf.tenants t ON au.tenant_id = t.id
                ORDER BY au.created_at DESC
            """)
            
            rows = cur.fetchall()
            users = []
            for row in rows:
                users.append({
                    'id': row[0],
                    'username': row[1],
                    'email': row[2],
                    'role': row[3],
                    'tenant_id': row[4],
                    'tenant_name': row[5],
                    'is_active': row[6],
                    'last_login_at': row[7].isoformat() if row[7] else None,
                    'created_at': row[8].isoformat() if row[8] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'users': users}),
                'isBase64Encoded': False
            }

        elif method == 'POST':
            # Создать нового администратора
            body = json.loads(event.get('body', '{}'))
            username = body.get('username', '')
            password = body.get('password', '')
            email = body.get('email', '')
            role = body.get('role', 'tenant_admin')
            tenant_id = body.get('tenant_id')

            if not username or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'username and password required'}),
                    'isBase64Encoded': False
                }

            if role not in ['super_admin', 'tenant_admin']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'invalid role'}),
                    'isBase64Encoded': False
                }

            if role == 'tenant_admin' and not tenant_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'tenant_id required for tenant_admin'}),
                    'isBase64Encoded': False
                }

            if role == 'super_admin':
                tenant_id = None

            password_hash = hashlib.sha256(password.encode()).hexdigest()

            try:
                cur.execute("""
                    INSERT INTO t_p56134400_telegram_ai_bot_pdf.admin_users 
                    (username, password_hash, email, role, tenant_id, is_active)
                    VALUES (%s, %s, %s, %s, %s, true)
                    RETURNING id
                """, (username, password_hash, email, role, tenant_id))
                
                user_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'user_id': user_id}),
                    'isBase64Encoded': False
                }
            except psycopg2.IntegrityError as e:
                conn.rollback()
                return {
                    'statusCode': 409,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Username already exists'}),
                    'isBase64Encoded': False
                }
            finally:
                cur.close()
                conn.close()

        elif method == 'PUT':
            # Изменить пароль администратора
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            new_password = body.get('new_password')

            if not user_id or not new_password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id and new_password required'}),
                    'isBase64Encoded': False
                }

            password_hash = hashlib.sha256(new_password.encode()).hexdigest()

            cur.execute("""
                UPDATE t_p56134400_telegram_ai_bot_pdf.admin_users
                SET password_hash = %s, updated_at = NOW()
                WHERE id = %s
            """, (password_hash, user_id))
            
            conn.commit()
            cur.close()
            conn.close()

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Password updated'}),
                'isBase64Encoded': False
            }

        elif method == 'PATCH':
            # Изменить статус активности администратора
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            is_active = body.get('is_active')

            if user_id is None or is_active is None:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id and is_active required'}),
                    'isBase64Encoded': False
                }

            cur.execute("""
                UPDATE t_p56134400_telegram_ai_bot_pdf.admin_users
                SET is_active = %s, updated_at = NOW()
                WHERE id = %s
            """, (is_active, user_id))
            
            conn.commit()
            cur.close()
            conn.close()

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Status updated'}),
                'isBase64Encoded': False
            }

        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
