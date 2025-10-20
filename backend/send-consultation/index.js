/**
 * Business: Send consultation request via email using Resend API
 * Args: event with httpMethod POST, body with name and phone fields
 * Returns: HTTP response with success status or error message
 */

const { Resend } = require('resend');

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

  const resendApiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.EMAIL_TO;

  if (!resendApiKey || !emailTo) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Email service not configured' }),
      isBase64Encoded: false
    };
  }

  try {
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: 'Полимер-проект <onboarding@resend.dev>',
      to: emailTo,
      subject: `Новая заявка на консультацию - ${requestData.name}`,
      html: `
        <h2>Новая заявка на консультацию</h2>
        <p><strong>Имя:</strong> ${requestData.name}</p>
        <p><strong>Телефон:</strong> ${requestData.phone}</p>
        <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
      `
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
      isBase64Encoded: false
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to send email' }),
      isBase64Encoded: false
    };
  }
};
