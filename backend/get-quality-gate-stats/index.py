import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Получение статистики Quality Gate"""
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
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN context_ok THEN 1 ELSE 0 END) as passed,
                SUM(CASE WHEN NOT context_ok THEN 1 ELSE 0 END) as failed
            FROM t_p56134400_telegram_ai_bot_pdf.quality_gate_logs
        """)
        totals = cur.fetchone()
        total = int(totals[0]) if totals[0] else 0
        passed = int(totals[1]) if totals[1] else 0
        failed = int(totals[2]) if totals[2] else 0
        pass_rate = (passed / total * 100) if total > 0 else 0

        cur.execute("""
            SELECT gate_reason, COUNT(*) 
            FROM t_p56134400_telegram_ai_bot_pdf.quality_gate_logs
            GROUP BY gate_reason
            ORDER BY COUNT(*) DESC
        """)
        by_reason = {row[0]: int(row[1]) for row in cur.fetchall()}

        cur.execute("""
            SELECT query_type, COUNT(*) 
            FROM t_p56134400_telegram_ai_bot_pdf.quality_gate_logs
            WHERE query_type IS NOT NULL
            GROUP BY query_type
            ORDER BY COUNT(*) DESC
        """)
        by_query_type = {row[0]: int(row[1]) for row in cur.fetchall()}

        cur.execute("""
            SELECT lang, COUNT(*) 
            FROM t_p56134400_telegram_ai_bot_pdf.quality_gate_logs
            WHERE lang IS NOT NULL
            GROUP BY lang
            ORDER BY COUNT(*) DESC
        """)
        by_lang = {row[0]: int(row[1]) for row in cur.fetchall()}

        cur.execute("""
            SELECT id, user_message, context_ok, gate_reason, query_type, 
                   lang, best_similarity, context_len, overlap, key_tokens, created_at
            FROM t_p56134400_telegram_ai_bot_pdf.quality_gate_logs
            ORDER BY created_at DESC
            LIMIT 50
        """)
        logs_rows = cur.fetchall()
        recent_logs = []
        for row in logs_rows:
            recent_logs.append({
                'id': row[0],
                'user_message': row[1],
                'context_ok': row[2],
                'gate_reason': row[3],
                'query_type': row[4] or '',
                'lang': row[5] or '',
                'best_similarity': float(row[6]) if row[6] is not None else None,
                'context_len': row[7],
                'overlap': float(row[8]) if row[8] is not None else None,
                'key_tokens': row[9],
                'created_at': row[10].isoformat() if row[10] else None
            })

        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'stats': {
                    'total': total,
                    'passed': passed,
                    'failed': failed,
                    'pass_rate': pass_rate,
                    'by_reason': by_reason,
                    'by_query_type': by_query_type,
                    'by_lang': by_lang
                },
                'recent_logs': recent_logs
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
