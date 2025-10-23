'''
Business: Manage user orders - create, list, and retrieve order details
Args: event with httpMethod, body (order data), headers (X-Auth-Token)
Returns: HTTP response with order data or list of orders
'''

import json
import os
import jwt
from typing import Dict, Any, Optional
import psycopg2
import psycopg2.extras

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    secret = os.environ.get('JWT_SECRET', 'default-secret-key')
    try:
        return jwt.decode(token, str(secret), algorithms=['HS256'])
    except:
        return None

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    token = event.get('headers', {}).get('x-auth-token') or event.get('headers', {}).get('X-Auth-Token')
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется авторизация'})
        }
    
    payload = verify_token(token)
    if not payload:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Недействительный токен'})
        }
    
    user_id = payload['user_id']
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            order_data = body.get('order_data')
            total_price = body.get('total_price', 0)
            
            if not order_data:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Данные заказа обязательны'})
                }
            
            cur.execute(
                "INSERT INTO orders (user_id, order_data, total_price, status) VALUES (%s, %s, %s, %s) RETURNING id, created_at",
                (user_id, json.dumps(order_data), total_price, 'new')
            )
            order = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'order_id': order[0],
                    'created_at': order[1].isoformat(),
                    'status': 'new'
                })
            }
        
        elif method == 'GET':
            cur.execute(
                "SELECT id, order_data, total_price, status, created_at FROM orders WHERE user_id = %s ORDER BY created_at DESC",
                (user_id,)
            )
            orders = cur.fetchall()
            
            orders_list = [
                {
                    'id': order[0],
                    'order_data': order[1],
                    'total_price': float(order[2]),
                    'status': order[3],
                    'created_at': order[4].isoformat()
                }
                for order in orders
            ]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'orders': orders_list})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Метод не поддерживается'})
            }
    
    finally:
        cur.close()
        conn.close()