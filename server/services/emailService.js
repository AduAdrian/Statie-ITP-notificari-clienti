const nodemailer = require('nodemailer');

// Create transporter with production email credentials
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'mail.misedainspectsrl.ro',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER || 'notificari-sms@misedainspectsrl.ro',
        pass: process.env.EMAIL_PASS || 'Kreator1234!'
    },
    tls: {
        rejectUnauthorized: false // for self-signed certificates if needed
    }
});

const sendNotificationEmail = async (userEmail, userName, subject, message, additionalInfo = {}) => {
    try {
        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>NotificARI - ${subject}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 30px; line-height: 1.6; }
                .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
                .highlight { background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; border-radius: 4px; }
                .button { background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔔 NotificARI</h1>
                    <p>Sistem de Notificări pentru Stații ITP</p>
                </div>
                <div class="content">
                    <h2>Bună ziua ${userName || 'utilizatorule'},</h2>
                    <p>${message}</p>
                    ${additionalInfo.details ? `<div class="highlight"><strong>Detalii:</strong><br>${additionalInfo.details}</div>` : ''}
                    ${additionalInfo.actionUrl ? `<a href="${additionalInfo.actionUrl}" class="button">Vizualizează</a>` : ''}
                </div>
                <div class="footer">
                    <p>© 2025 NotificARI - Sistem de Notificări</p>
                    <p>Acest email a fost generat automat.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: {
                name: 'NotificARI',
                address: process.env.EMAIL_USER || 'notificari-sms@misedainspectsrl.ro'
            },
            to: userEmail,
            subject: subject,
            html: htmlTemplate
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending notification email:', error);
        throw error;
    }
};

const sendResetLinkEmail = async (userEmail, resetLink, userName = null) => {
    try {
        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>NotificARI - Resetare Parolă</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f5f5f5;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 25px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0 0 10px 0;
                    font-size: 28px;
                    font-weight: 600;
                }
                .header p {
                    margin: 0;
                    font-size: 16px;
                    opacity: 0.9;
                }
                .content {
                    padding: 40px 30px;
                    line-height: 1.7;
                }
                .info {
                    margin: 15px 0;
                    font-size: 16px;
                    color: #444;
                }
                .button-container {
                    text-align: center;
                    margin: 30px 0;
                }
                .reset-button {
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    display: inline-block;
                    font-weight: 600;
                    font-size: 16px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                }
                .reset-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
                }
                .warning {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 25px 0;
                }
                .warning p {
                    margin: 5px 0;
                    color: #856404;
                }
                .footer {
                    background-color: #f8f9fa;
                    padding: 30px;
                    text-align: center;
                    border-top: 1px solid #eee;
                }
                .footer p {
                    margin: 10px 0;
                    color: #666;
                }
                .small {
                    font-size: 14px;
                    color: #888;
                }
                hr {
                    border: none;
                    border-top: 1px solid #eee;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔓 Resetare Parolă</h1>
                    <p>NotificARI - Sistem de Notificări pentru Stații ITP</p>
                </div>
                <div class="content">
                    <p class="info">
                        ${userName ? `Bună ziua ${userName},` : 'Bună ziua,'}
                    </p>
                    
                    <p class="info">
                        Ați solicitat resetarea parolei pentru contul dumneavoastră de pe <strong>NotificARI</strong>.
                    </p>
                    
                    <p class="info">
                        Pentru a reseta parola, faceți click pe butonul de mai jos:
                    </p>
                    
                    <div class="button-container">
                        <a href="${resetLink}" class="reset-button">
                            🔓 Resetează Parola
                        </a>
                    </div>
                    
                    <p class="info">
                        <strong>Link-ul este valabil pentru 1 oră.</strong> După această perioadă va trebui să solicitați din nou resetarea.
                    </p>
                    
                    <div class="warning">
                        <p><strong>⚠️ Atenție!</strong></p>
                        <p>Dacă nu ați solicitat resetarea parolei, ignorați acest email. Parola dumneavoastră rămâne neschimbată și sigură.</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Cu respect,<br><strong>Echipa NotificARI</strong></p>
                    <hr>
                    <p class="small">
                        Acest email a fost generat automat. Vă rugăm să nu răspundeți la acest mesaj.
                    </p>
                    <p class="small">
                        © 2025 NotificARI - Sistem de Notificări pentru Stații ITP
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: {
                name: 'NotificARI - Resetare Parolă',
                address: process.env.EMAIL_USER || 'notificari-sms@misedainspectsrl.ro'
            },
            to: userEmail,
            subject: 'NotificARI - Resetează-ți parola',
            html: htmlTemplate
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Reset link email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending reset link email:', error);
        throw error;
    }
};

const sendAccountConfirmationEmail = async (userEmail, userName, databaseName) => {
    try {
        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>NotificARI - Confirmare Cont</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    margin: 0; padding: 0; 
                    background-color: #f8f9fa; 
                    line-height: 1.6; 
                    color: #333;
                }
                .container { 
                    max-width: 600px; 
                    margin: 20px auto; 
                    background-color: #ffffff; 
                    border-radius: 12px; 
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                .header { 
                    background: linear-gradient(135deg, #28a745 0%, #20c997 50%, #17a2b8 100%);
                    color: white; 
                    padding: 40px 30px; 
                    text-align: center; 
                }
                .header h1 {
                    margin: 0;
                    font-size: 32px;
                    font-weight: 600;
                }
                .header p {
                    margin: 10px 0 0 0;
                    font-size: 16px;
                    opacity: 0.9;
                }
                .content { 
                    padding: 40px 30px; 
                }
                .welcome-message {
                    font-size: 18px;
                    color: #28a745;
                    font-weight: 600;
                    margin-bottom: 20px;
                }
                .success-badge {
                    background-color: #d4edda;
                    border: 1px solid #c3e6cb;
                    color: #155724;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: center;
                    font-weight: 600;
                }
                .details-box {
                    background-color: #f8f9fa;
                    border-left: 4px solid #28a745;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 0 8px 8px 0;
                }
                .details-box h3 {
                    margin: 0 0 15px 0;
                    color: #28a745;
                    font-size: 18px;
                }
                .detail-item {
                    margin: 10px 0;
                    padding: 8px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                .detail-item:last-child {
                    border-bottom: none;
                }
                .detail-label {
                    font-weight: 600;
                    color: #495057;
                    display: inline-block;
                    width: 140px;
                }
                .detail-value {
                    color: #28a745;
                    font-weight: 600;
                }
                .next-steps {
                    background-color: #e3f2fd;
                    border: 1px solid #bbdefb;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 25px 0;
                }
                .next-steps h3 {
                    margin: 0 0 15px 0;
                    color: #1976d2;
                }
                .step {
                    margin: 10px 0;
                    padding-left: 25px;
                    position: relative;
                }
                .step::before {
                    content: "→";
                    position: absolute;
                    left: 0;
                    color: #1976d2;
                    font-weight: bold;
                }
                .login-button {
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    display: inline-block;
                    margin: 25px 0;
                    font-weight: 600;
                    text-align: center;
                    transition: transform 0.2s;
                }
                .login-button:hover {
                    transform: translateY(-2px);
                }
                .footer { 
                    background-color: #f8f9fa; 
                    padding: 30px; 
                    text-align: center; 
                    border-top: 1px solid #e9ecef;
                }
                .footer p {
                    margin: 5px 0;
                    color: #6c757d;
                    font-size: 14px;
                }
                .small {
                    font-size: 12px;
                    color: #adb5bd;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 NotificARI</h1>
                    <p>Sistem de Notificări pentru Stații ITP</p>
                </div>
                
                <div class="content">
                    <div class="welcome-message">
                        Bună ziua ${userName}!
                    </div>
                    
                    <div class="success-badge">
                        ✅ Contul dumneavoastră a fost creat cu succes!
                    </div>
                    
                    <p>Vă mulțumim pentru înregistrarea în sistemul <strong>NotificARI</strong>! Contul dumneavoastră a fost configurat și este gata de utilizare.</p>
                    
                    <div class="details-box">
                        <h3>📋 Detaliile contului:</h3>
                        <div class="detail-item">
                            <span class="detail-label">Nume complet:</span>
                            <span class="detail-value">${userName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${userEmail}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Baza de date:</span>
                            <span class="detail-value">${databaseName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Status:</span>
                            <span class="detail-value">🟢 Activ</span>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h3>🚀 Pașii următori:</h3>
                        <div class="step">Accesați aplicația folosind butonul de mai jos</div>
                        <div class="step">Conectați-vă cu email-ul și parola alese</div>
                        <div class="step">Configurați prima notificare pentru clienții dumneavoastră</div>
                        <div class="step">Importați datele din Excel pentru automatizare completă</div>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="login-button">
                            🔐 Accesează Aplicația
                        </a>
                    </div>
                    
                    <p><strong>Caracteristici disponibile:</strong></p>
                    <ul>
                        <li>📧 Notificări prin email automatizate</li>
                        <li>📱 Notificări prin SMS</li>
                        <li>📊 Import masiv din fișiere Excel</li>
                        <li>🔄 Programare automată a notificărilor</li>
                        <li>📈 Rapoarte detaliate</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p><strong>Echipa NotificARI</strong></p>
                    <p>Pentru suport tehnic, vă rugăm să ne contactați.</p>
                    <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
                    <p class="small">
                        Acest email a fost generat automat. Vă rugăm să nu răspundeți la acest mesaj.
                    </p>
                    <p class="small">
                        © 2025 NotificARI - Sistem de Notificări pentru Stații ITP
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: {
                name: 'NotificARI - Confirmare Cont',
                address: process.env.EMAIL_USER || 'notificari-sms@misedainspectsrl.ro'
            },
            to: userEmail,
            subject: '🎉 Bun venit la NotificARI - Contul a fost creat cu succes!',
            html: htmlTemplate
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Account confirmation email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending account confirmation email:', error);
        throw error;
    }
};

const testEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('Email service is ready to send emails');
        return true;
    } catch (error) {
        console.error('Email service configuration error:', error.message);
        return false;
    }
};

module.exports = { sendNotificationEmail, sendResetLinkEmail, sendAccountConfirmationEmail, testEmailConnection };
