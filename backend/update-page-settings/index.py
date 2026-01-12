import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    """Обновление настроек страницы и быстрых вопросов"""
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
        settings = body.get('settings', {})
        quick_questions = body.get('quickQuestions', [])

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()

        for key, value in settings.items():
            cur.execute("""
                INSERT INTO t_p56134400_telegram_ai_bot_pdf.page_settings (setting_key, setting_value, updated_at)
                VALUES (%s, %s, %s)
                ON CONFLICT (setting_key) 
                DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = EXCLUDED.updated_at
            """, (key, value, datetime.now()))

        cur.execute("DELETE FROM t_p56134400_telegram_ai_bot_pdf.quick_questions")
        
        for idx, q in enumerate(quick_questions):
            cur.execute("""
                INSERT INTO t_p56134400_telegram_ai_bot_pdf.quick_questions 
                (text, question, icon, sort_order)
                VALUES (%s, %s, %s, %s)
            """, (q['text'], q['question'], q.get('icon', 'HelpCircle'), idx))

        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
