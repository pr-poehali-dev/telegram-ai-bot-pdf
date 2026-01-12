import os
import jwt
import json
from typing import Optional, Dict, Tuple

def verify_jwt_token(token: str) -> Tuple[bool, Optional[Dict], Optional[str]]:
    try:
        jwt_secret = os.environ.get('JWT_SECRET', 'default-jwt-secret-change-in-production')
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return True, payload, None
    except jwt.ExpiredSignatureError:
        return False, None, 'Token expired'
    except jwt.InvalidTokenError:
        return False, None, 'Invalid token'
    except Exception as e:
        return False, None, str(e)

def extract_token_from_headers(headers: Dict) -> Optional[str]:
    auth_header = headers.get('Authorization') or headers.get('authorization')
    x_auth_header = headers.get('X-Authorization') or headers.get('x-authorization')
    token_header = auth_header or x_auth_header
    if not token_header:
        return None
    if token_header.startswith('Bearer '):
        return token_header[7:]
    return token_header

def get_tenant_id_from_request(event: dict) -> Tuple[Optional[int], Optional[Dict]]:
    headers = event.get('headers', {})
    token = extract_token_from_headers(headers)
    
    if not token:
        return None, {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Authorization required'}),
            'isBase64Encoded': False
        }
    
    success, payload, error = verify_jwt_token(token)
    if not success:
        return None, {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': error or 'Invalid token'}),
            'isBase64Encoded': False
        }
    
    user_role = payload.get('role')
    user_tenant_id = payload.get('tenant_id')
    query_params = event.get('queryStringParameters') or {}
    requested_tenant_id = query_params.get('tenant_id')
    
    if requested_tenant_id:
        try:
            requested_tenant_id = int(requested_tenant_id)
        except ValueError:
            return None, {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid tenant_id format'}),
                'isBase64Encoded': False
            }
        
        if user_role == 'super_admin':
            return requested_tenant_id, None
        elif user_role == 'tenant_admin' and user_tenant_id == requested_tenant_id:
            return requested_tenant_id, None
        else:
            return None, {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Access denied'}),
                'isBase64Encoded': False
            }
    
    if user_role == 'tenant_admin':
        return user_tenant_id, None
    
    return None, {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'tenant_id required'}),
        'isBase64Encoded': False
    }
