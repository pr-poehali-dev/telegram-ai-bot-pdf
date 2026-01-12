import json
import os
import requests

def handler(event: dict, context) -> dict:
    """Webhook для WhatsApp-бота: принимает сообщения и отвечает через AI-консьержа"""
    method = event.get('httpMethod', 'POST')

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

    if method == 'GET':
        params = event.get('queryStringParameters', {})
        mode = params.get('hub.mode')
        token = params.get('hub.verify_token')
        challenge = params.get('hub.challenge')

        verify_token = os.environ.get('WHATSAPP_VERIFY_TOKEN')

        if mode == 'subscribe' and token == verify_token:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'},
                'body': challenge,
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Verification failed'}),
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
        
        if 'entry' not in body or not body['entry']:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'status': 'ok'}),
                'isBase64Encoded': False
            }

        entry = body['entry'][0]
        changes = entry.get('changes', [])
        
        if not changes:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'status': 'ok'}),
                'isBase64Encoded': False
            }

        value = changes[0].get('value', {})
        messages = value.get('messages', [])

        if not messages:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'status': 'ok'}),
                'isBase64Encoded': False
            }

        message = messages[0]
        from_number = message.get('from')
        message_type = message.get('type')

        if message_type != 'text':
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'status': 'ok'}),
                'isBase64Encoded': False
            }

        user_message = message.get('text', {}).get('body', '')

        if not user_message:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'status': 'ok'}),
                'isBase64Encoded': False
            }

        session_id = f"whatsapp-{from_number}"
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

        access_token = os.environ.get('WHATSAPP_ACCESS_TOKEN')
        phone_number_id = os.environ.get('WHATSAPP_PHONE_NUMBER_ID')
        
        if not access_token or not phone_number_id:
            raise Exception('WhatsApp credentials not configured')

        whatsapp_api_url = f'https://graph.facebook.com/v18.0/{phone_number_id}/messages'
        whatsapp_response = requests.post(
            whatsapp_api_url,
            json={
                'messaging_product': 'whatsapp',
                'to': from_number,
                'type': 'text',
                'text': {'body': ai_message}
            },
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            },
            timeout=10
        )

        if not whatsapp_response.ok:
            raise Exception(f'WhatsApp API error: {whatsapp_response.status_code}')

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'status': 'ok'}),
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
