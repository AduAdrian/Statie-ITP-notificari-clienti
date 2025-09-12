const axios = require('axios');

const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGI0NTcwY2Y4MjkzYzRlM2Y2NmYzNWYifQ.4Jlpsb-Ure4i-x4y4nw8cff9p1A6LLMuJfIuIJg89N8'; // It's recommended to store this in an environment variable

const sendSms = async (phone, plateNumber) => {
    const message = `Buna ziua , va expira ITP la auto cu numaraul ${plateNumber} . TEST`;
    const data = JSON.stringify({
        phone: phone,
        shortTextMessage: message,
        sendAsShort: true
    });

    const config = {
        method: 'post',
        url: 'https://www.smsadvert.ro/api/sms/',
        headers: {
            'Authorization': API_TOKEN,
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const response = await axios(config);
        console.log('SMS sent successfully:', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Función para enviar código de reseteo por SMS
const sendResetCodeSms = async (phone, resetCode) => {
    const message = `Codul dvs de resetare parola: ${resetCode}. Acesta expira in 10 minute.`;
    const data = JSON.stringify({
        phone: phone,
        shortTextMessage: message,
        sendAsShort: true
    });

    const config = {
        method: 'post',
        url: 'https://www.smsadvert.ro/api/sms/',
        headers: {
            'Authorization': API_TOKEN,
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const response = await axios(config);
        console.log('Reset code SMS sent successfully:', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Error sending reset code SMS:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = { sendSms, sendResetCodeSms };
