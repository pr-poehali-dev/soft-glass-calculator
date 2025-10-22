import json
import os
from typing import Dict, Any
from pydantic import BaseModel, Field, validator
import requests

class ConsultationRequest(BaseModel):
    '''
    Business: Модель данных заявки на консультацию
    '''
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=20)
    
    @validator('phone')
    def validate_phone(cls, v):
        digits = ''.join(filter(str.isdigit, v))
        if len(digits) < 10:
            raise ValueError('Номер телефона должен содержать минимум 10 цифр')
        return v

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обработка заявки на консультацию и отправка в Telegram
    Args: event - dict с httpMethod, body, headers
          context - объект с request_id, function_name и другими атрибутами
    Returns: HTTP response dict с результатом отправки
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        consultation = ConsultationRequest(**body_data)
        
        telegram_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        telegram_chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        
        if not telegram_token or not telegram_chat_id:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Telegram credentials not configured'
                }),
                'isBase64Encoded': False
            }
        
        message = f"""
🔔 Новая заявка на консультацию!

👤 Имя: {consultation.name}
📞 Телефон: {consultation.phone}

⏰ Свяжитесь с клиентом в ближайшее время!
"""
        
        telegram_url = f'https://api.telegram.org/bot{telegram_token}/sendMessage'
        telegram_response = requests.post(
            telegram_url,
            json={
                'chat_id': telegram_chat_id,
                'text': message,
                'parse_mode': 'HTML'
            },
            timeout=10
        )
        
        if telegram_response.status_code == 200:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Заявка успешно отправлена'
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Failed to send Telegram message'
                }),
                'isBase64Encoded': False
            }
            
    except ValueError as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            }),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': 'Internal server error'
            }),
            'isBase64Encoded': False
        }
