"""
Обработчик заявок с лендинга Дорошенко Андрея.
Отправляет данные формы на почту and-doroshe@mail.ru.
"""

import json
import os
import urllib.request
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

    tg_token = os.environ.get('TELEGRAM_BOT_TOKEN', '8852572599:AAFDZAgUWAm7AlaIMXp1cumdQe-haoRcRmA')
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