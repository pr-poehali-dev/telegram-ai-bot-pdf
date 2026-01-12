import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Получение настроек страницы и быстрых вопросов"""
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

        cur.execute("""
            SELECT setting_key, setting_value 
            FROM t_p56134400_telegram_ai_bot_pdf.page_settings
        """)
        rows = cur.fetchall()
        settings = {row[0]: row[1] for row in rows}

        cur.execute("""
            SELECT id, text, question, icon, sort_order
            FROM t_p56134400_telegram_ai_bot_pdf.quick_questions
            ORDER BY sort_order, id
        """)
        questions_rows = cur.fetchall()
        quick_questions = [
            {
                'id': row[0],
                'text': row[1],
                'question': row[2],
                'icon': row[3],
                'sort_order': row[4]
            }
            for row in questions_rows
        ]

        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'settings': settings,
                'quickQuestions': quick_questions
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
