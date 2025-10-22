/**
 * Business: Send consultation request to Telegram
 * Args: event with httpMethod POST, body with name and phone fields
 * Returns: HTTP response with success status or error message
 */

exports.handler = async (event, context) => {
  const { httpMethod, body } = event;

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      },
      body: '',
      isBase64Encoded: false
    };
  }

  if (httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
      isBase64Encoded: false
    };
  }

  const requestData = JSON.parse(body || '{}');
  
  if (!requestData.name || !requestData.phone) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Name and phone are required' }),
      isBase64Encoded: false
    };
  }

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramBotToken || !telegramChatId) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Telegram not configured' }),
      isBase64Encoded: false
    };
  }

  try {
    const escapeName = requestData.name.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
    const escapePhone = requestData.phone.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
    
    const message = `🔔 *Новая заявка на консультацию\\!*\n\n👤 *Имя:* ${escapeName}\n📞 *Телефон:* ${escapePhone}\n\n⏰ Свяжитесь с клиентом в ближайшее время\\!`;

    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'MarkdownV2'
      })
    });

    const result = await response.json();
    
    console.log('Telegram send result:', JSON.stringify(result));

    if (!result.ok) {
      throw new Error(`Telegram API error: ${result.description || 'Unknown error'}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true, message: 'Notification sent' }),
      isBase64Encoded: false
    };
  } catch (error) {
    console.error('Error sending telegram:', error);
    console.error('Error details:', JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to send notification', details: error.message }),
      isBase64Encoded: false
    };
  }
};