"""
Обработчик заявок с лендинга Дорошенко Андрея.
Отправляет данные формы на почту and-doroshe@mail.ru.
"""

import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime


def handler(event: dict, context) -> dict:
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': cors_headers, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')

    name = body.get('name', '—')
    phone = body.get('phone', '—')
    city = body.get('city', '—')
    company = body.get('company', '—')
    message = body.get('message', '—')
    form_type = body.get('type', 'unknown')

    now = datetime.now().strftime('%d.%m.%Y %H:%M')
    form_label = 'Шапка (аудит)' if form_type == 'audit' else 'Нижняя форма'

    smtp_user = 'and-doroshe@mail.ru'
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    to_email = 'and-doroshe@mail.ru'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта — {name}'
    msg['From'] = smtp_user
    msg['To'] = to_email

    html = f"""
    <html><body style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #1a1a2e;">📋 Новая заявка с сайта</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
        <tr><td style="padding: 8px; font-weight: bold;">Имя:</td><td style="padding: 8px;">{name}</td></tr>
        <tr style="background:#f5f5f5"><td style="padding: 8px; font-weight: bold;">Телефон:</td><td style="padding: 8px;">{phone}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Город:</td><td style="padding: 8px;">{city}</td></tr>
        <tr style="background:#f5f5f5"><td style="padding: 8px; font-weight: bold;">Компания:</td><td style="padding: 8px;">{company}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Форма:</td><td style="padding: 8px;">{form_label}</td></tr>
        {"<tr style='background:#f5f5f5'><td style='padding: 8px; font-weight: bold;'>Сообщение:</td><td style='padding: 8px;'>" + message + "</td></tr>" if message and message != '—' else ''}
        <tr><td style="padding: 8px; font-weight: bold;">Время:</td><td style="padding: 8px;">{now}</td></tr>
    </table>
    </body></html>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True, 'message': 'Заявка отправлена'})
    }
