import json
import os
import requests

def handler(event: dict, context) -> dict:
    """Webhook для MAX-бота: принимает сообщения и отвечает через AI-консьержа"""
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
        
        if 'message' not in body:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'ok': True}),
                'isBase64Encoded': False
            }

        message = body['message']
        chat_id = message['chat']['id']
        user_message = message.get('text', '')

        if not user_message:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'ok': True}),
                'isBase64Encoded': False
            }

        session_id = f"max-{chat_id}"
        chat_function_url = os.environ.get('CHAT_FUNCTION_URL')

        chat_response = requests.post(
            chat_function_url,
            json={
                'message': user_message,
                'sessionId': session_id
            },
            headers={'Content-Type': 'application/json'},
            timeout=30
        )

        if not chat_response.ok:
            raise Exception(f'Chat function error: {chat_response.status_code}')

        chat_data = chat_response.json()
        ai_message = chat_data.get('message', 'Извините, не могу ответить')

        bot_token = os.environ.get('MAX_BOT_TOKEN')
        if not bot_token:
            raise Exception('MAX_BOT_TOKEN not configured')

        max_api_url = f'https://platform-api.max.ru/bot{bot_token}/sendMessage'
        max_response = requests.post(
            max_api_url,
            json={
                'chat_id': chat_id,
                'text': ai_message
            },
            timeout=10
        )

        if not max_response.ok:
            raise Exception(f'MAX API error: {max_response.status_code}')

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True}),
            'isBase64Encoded': False
        }

    except Exception as e:
        print(f'Webhook error: {e}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
