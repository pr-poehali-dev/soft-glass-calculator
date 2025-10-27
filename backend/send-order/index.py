import json
import base64
import os
from typing import Dict, Any, List
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import psycopg2
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        email_to = os.environ.get('EMAIL_TO', 'proekt-polimer@mail.ru')
        windows = body_data.get('windows', [])
        total = body_data.get('total', 0)
        images = body_data.get('images', [])
        comment = body_data.get('comment', '')
        files_info = body_data.get('files', [])
        
        db_dsn = os.environ.get('DATABASE_URL', '')
        conn = psycopg2.connect(db_dsn)
        cur = conn.cursor()
        
        order_data = {
            'windows': windows,
            'comment': comment,
            'images_count': len(images),
            'files_count': len(files_info),
            'created_at': datetime.now().isoformat()
        }
        
        cur.execute(
            "INSERT INTO t_p92177054_soft_glass_calculato.orders (order_data, total_price, status) VALUES (%s, %s, %s) RETURNING id",
            (json.dumps(order_data), total, 'new')
        )
        order_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        msg = MIMEMultipart()
        msg['From'] = 'noreply@poehali.dev'
        msg['To'] = email_to
        msg['Subject'] = f'Заявка #{order_id} на расчет ПВХ окон - {len(windows)} шт'
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Новая заявка #{order_id} на расчет ПВХ окон</h2>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Количество окон:</strong> {len(windows)} шт</p>
                <p style="margin: 5px 0;"><strong>Общая стоимость:</strong> {total} ₽</p>
                <p style="margin: 5px 0;"><strong>Загружено фотографий:</strong> {len(images)} шт</p>
            </div>
        """
        
        if comment:
            html_content += f"""
            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <h3 style="color: #1f2937; margin-top: 0;">Комментарий клиента:</h3>
                <p style="margin: 0; white-space: pre-wrap;">{comment}</p>
            </div>
            """
        
        html_content += """
            <h3 style="color: #1f2937;">Детали расчета:</h3>
        """
        
        for idx, window in enumerate(windows, 1):
            html_content += f"""
            <div style="border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 8px;">
                <h4 style="color: #2563eb; margin-top: 0;">Окно {idx}</h4>
                <p><strong>Размеры:</strong> {window.get('верх')}×{window.get('право')} мм</p>
                <p><strong>Площадь:</strong> {window.get('area', 0):.2f} м²</p>
                <p><strong>Стоимость:</strong> {window.get('price', 0)} ₽</p>
            </div>
            """
        
        html_content += """
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))
        
        for idx, image_data in enumerate(images):
            try:
                image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(image_bytes)
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f'attachment; filename="photo_{idx + 1}.jpg"')
                msg.attach(part)
            except Exception as e:
                print(f'Error attaching image {idx}: {e}')
        
        files_list = body_data.get('files', [])
        for idx, file_info in enumerate(files_list):
            try:
                file_data = file_info.get('data', '')
                file_name = file_info.get('name', f'document_{idx + 1}')
                file_type = file_info.get('type', 'application/octet-stream')
                
                file_bytes = base64.b64decode(file_data.split(',')[1] if ',' in file_data else file_data)
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(file_bytes)
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f'attachment; filename="{file_name}"')
                msg.attach(part)
            except Exception as e:
                print(f'Error attaching file {idx}: {e}')
        
        smtp_server = 'smtp.mail.ru'
        smtp_port = 587
        smtp_user = 'noreply@poehali.dev'
        smtp_password = os.environ.get('SMTP_PASSWORD', '')
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'message': f'Заявка #{order_id} отправлена', 'orderId': order_id})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }