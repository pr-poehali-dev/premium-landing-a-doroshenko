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
import urllib.request


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

    subject = f'Новая заявка с сайта — {name} ({now})'

    html_body = f"""
<html>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
    <div style="background: #0A0A0A; padding: 24px 32px;">
      <h2 style="color: #C9A96E; margin: 0; font-size: 20px;">Новая заявка с лендинга</h2>
      <p style="color: rgba(255,255,255,0.5); margin: 6px 0 0; font-size: 13px;">{now}</p>
    </div>
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #888; font-size: 13px; width: 140px;">ФИО</td>
          <td style="padding: 10px 0; color: #111; font-size: 15px; font-weight: 600;">{name}</td>
        </tr>
        <tr style="border-top: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; color: #888; font-size: 13px;">Телефон</td>
          <td style="padding: 10px 0; color: #111; font-size: 15px; font-weight: 600;">{phone}</td>
        </tr>
        <tr style="border-top: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; color: #888; font-size: 13px;">Город</td>
          <td style="padding: 10px 0; color: #111; font-size: 15px;">{city}</td>
        </tr>
        <tr style="border-top: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; color: #888; font-size: 13px;">Компания</td>
          <td style="padding: 10px 0; color: #111; font-size: 15px;">{company}</td>
        </tr>
        <tr style="border-top: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; color: #888; font-size: 13px;">Тип формы</td>
          <td style="padding: 10px 0; color: #888; font-size: 13px;">{'Шапка (аудит)' if form_type == 'audit' else 'Нижняя форма'}</td>
        </tr>
        {f'''<tr style="border-top: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Сообщение</td>
          <td style="padding: 10px 0; color: #111; font-size: 15px;">{message}</td>
        </tr>''' if message and message != '—' else ''}
      </table>
    </div>
    <div style="background: #f9f9f9; padding: 16px 32px; border-top: 1px solid #eee;">
      <p style="margin: 0; color: #aaa; font-size: 12px;">Заявка с сайта doroshenko-direct.ru</p>
    </div>
  </div>
</body>
</html>
"""

    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    sender = 'and-doroshe@mail.ru'
    recipient = 'and-doroshe@mail.ru'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f'Лендинг Дорошенко <{sender}>'
    msg['To'] = recipient
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    if smtp_password:
        with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
            server.login(sender, smtp_password)
            server.sendmail(sender, recipient, msg.as_string())

    tg_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    tg_chat_id = '5601949122'
    if tg_token:
        form_label = 'Шапка (аудит)' if form_type == 'audit' else 'Нижняя форма'
        tg_text = (
            f'📋 *Новая заявка с сайта*\n\n'
            f'👤 *Имя:* {name}\n'
            f'📞 *Телефон:* {phone}\n'
            f'🏙 *Город:* {city}\n'
            f'🏢 *Компания:* {company}\n'
            f'📝 *Форма:* {form_label}\n'
            + (f'💬 *Сообщение:* {message}\n' if message and message != '—' else '')
            + f'🕐 *Время:* {now}'
        )
        tg_payload = json.dumps({
            'chat_id': tg_chat_id,
            'text': tg_text,
            'parse_mode': 'Markdown'
        }).encode('utf-8')
        tg_req = urllib.request.Request(
            f'https://api.telegram.org/bot{tg_token}/sendMessage',
            data=tg_payload,
            headers={'Content-Type': 'application/json'}
        )
        urllib.request.urlopen(tg_req)

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True, 'message': 'Заявка отправлена'})
    }