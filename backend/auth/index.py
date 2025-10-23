'''
Business: User authentication - registration, login, and token verification
Args: event with httpMethod, body (email, password, full_name, phone)
Returns: HTTP response with JWT token or error
'''

import json
import os
import jwt
import hashlib
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass
import psycopg2
import psycopg2.extras

@dataclass
class User:
    id: int
    email: str
    full_name: Optional[str]
    phone: Optional[str]

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(user_id: int, email: str) -> str:
    secret = os.environ.get('JWT_SECRET', 'default-secret-key')
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, str(secret), algorithm='HS256')

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    secret = os.environ.get('JWT_SECRET', 'default-secret-key')
    try:
        return jwt.decode(token, str(secret), algorithms=['HS256'])
    except:
        return None

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
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        try:
            if action == 'register':
                email = body.get('email')
                password = body.get('password')
                full_name = body.get('full_name')
                phone = body.get('phone')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email и пароль обязательны'})
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    "SELECT id FROM users WHERE email = %s",
                    (email,)
                )
                if cur.fetchone():
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь с таким email уже существует'})
                    }
                
                cur.execute(
                    "INSERT INTO users (email, password_hash, full_name, phone) VALUES (%s, %s, %s, %s) RETURNING id",
                    (email, password_hash, full_name, phone)
                )
                user_id = cur.fetchone()[0]
                conn.commit()
                
                token = generate_token(user_id, email)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'token': token,
                        'user': {'id': user_id, 'email': email, 'full_name': full_name, 'phone': phone}
                    })
                }
            
            elif action == 'login':
                email = body.get('email')
                password = body.get('password')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email и пароль обязательны'})
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    "SELECT id, email, full_name, phone FROM users WHERE email = %s AND password_hash = %s",
                    (email, password_hash)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный email или пароль'})
                    }
                
                token = generate_token(user[0], user[1])
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'token': token,
                        'user': {'id': user[0], 'email': user[1], 'full_name': user[2], 'phone': user[3]}
                    })
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неизвестное действие'})
                }
        
        finally:
            cur.close()
            conn.close()
    
    if method == 'GET':
        token = event.get('headers', {}).get('x-auth-token') or event.get('headers', {}).get('X-Auth-Token')
        
        if not token:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Токен не предоставлен'})
            }
        
        payload = verify_token(token)
        if not payload:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Недействительный токен'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        try:
            cur.execute(
                "SELECT id, email, full_name, phone FROM users WHERE id = %s",
                (payload['user_id'],)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пользователь не найден'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'user': {'id': user[0], 'email': user[1], 'full_name': user[2], 'phone': user[3]}
                })
            }
        
        finally:
            cur.close()
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }