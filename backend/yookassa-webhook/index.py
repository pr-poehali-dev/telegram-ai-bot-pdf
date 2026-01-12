import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    """Webhook для получения уведомлений от ЮKassa о статусе платежей"""
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
        
        event_type = body.get('event')
        payment_object = body.get('object', {})
        
        payment_id = payment_object.get('id')
        status = payment_object.get('status')
        amount = payment_object.get('amount', {}).get('value')
        description = payment_object.get('description')

        if not payment_id:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'ok': True}),
                'isBase64Encoded': False
            }

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

        cur.execute(f"""
            INSERT INTO {schema}.payments (payment_id, status, amount, description, event_type, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (payment_id) 
            DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
        """, (payment_id, status, amount, description, event_type, datetime.utcnow()))

        conn.commit()
        cur.close()
        conn.close()

        print(f'Payment {payment_id} updated with status {status}')

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True}),
            'isBase64Encoded': False
        }

    except Exception as e:
        print(f'Webhook processing error: {e}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
