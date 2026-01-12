import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Получение настроек AI провайдеров"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }

    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()

        # Получаем ai_settings из JSONB для tenant_id=1
        cur.execute("""
            SELECT ai_settings
            FROM t_p56134400_telegram_ai_bot_pdf.tenant_settings
            WHERE tenant_id = 1
        """)
        
        row = cur.fetchone()
        if row and row[0]:
            settings_raw = row[0]
            # Преобразуем строковые значения в числа где нужно
            settings = {
                'model': settings_raw.get('model', 'yandexgpt'),
                'temperature': float(settings_raw.get('temperature', 0.15)),
                'top_p': float(settings_raw.get('top_p', 1.0)),
                'frequency_penalty': float(settings_raw.get('frequency_penalty', 0)),
                'presence_penalty': float(settings_raw.get('presence_penalty', 0)),
                'max_tokens': int(settings_raw.get('max_tokens', 600)),
                'system_priority': settings_raw.get('system_priority', 'strict'),
                'creative_mode': settings_raw.get('creative_mode', 'off'),
                'chat_provider': settings_raw.get('chat_provider', 'deepseek'),
                'chat_model': settings_raw.get('chat_model', 'deepseek-chat'),
                'embedding_provider': settings_raw.get('embedding_provider', 'openai'),
                'embedding_model': settings_raw.get('embedding_model', 'text-embedding-3-small'),
                'system_prompt': settings_raw.get('system_prompt', 'Вы - вежливый и профессиональный консьерж отеля. Отвечайте на вопросы гостей, используя только информацию из базы знаний.')
            }
        else:
            settings = {
                'model': 'yandexgpt',
                'temperature': 0.15,
                'top_p': 1.0,
                'frequency_penalty': 0,
                'presence_penalty': 0,
                'max_tokens': 600,
                'system_priority': 'strict',
                'creative_mode': 'off',
                'chat_provider': 'deepseek',
                'chat_model': 'deepseek-chat',
                'embedding_provider': 'openai',
                'embedding_model': 'text-embedding-3-small',
                'system_prompt': 'Вы - вежливый и профессиональный консьерж отеля. Отвечайте на вопросы гостей, используя только информацию из базы знаний.'
            }

        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'settings': settings}),
            'isBase64Encoded': False
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }