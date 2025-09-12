# =============================================================================
# CONFIGURARE EMAIL notificari@misedainspectsrl.ro
# =============================================================================

## 1. 📧 Crearea contului de email

### În cPanel/Hosting Panel:
1. **Accesează Email Accounts**
2. **Create Email Account**:
   - Email: `notificari@misedainspectsrl.ro`
   - Password: Alegeți o parolă puternică
   - Mailbox Quota: Minimum 1GB

### Verificarea SMTP Settings:
```
Server SMTP: mail.misedainspectsrl.ro
Port: 587 (TLS) sau 465 (SSL)
Authentication: Required
Username: notificari@misedainspectsrl.ro
Password: parola-aleasa
```

## 2. 🔧 Configurarea în aplicație

### În fișierul .env.production:
```bash
# Email Configuration
EMAIL_SERVICE=custom
EMAIL_HOST=mail.misedainspectsrl.ro
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=notificari@misedainspectsrl.ro
EMAIL_PASS=parola-pentru-email-aici
```

### Pentru SSL (Port 465):
```bash
EMAIL_PORT=465
EMAIL_SECURE=true
```

## 3. 🛡️ Configurarea DNS pentru Email

### Records necesare în DNS:
```
# MX Record
Type: MX
Name: @
Value: mail.misedainspectsrl.ro
Priority: 10

# SPF Record (pentru evitarea spam)
Type: TXT
Name: @
Value: "v=spf1 include:_spf.your-hosting-provider.com ~all"

# DMARC Record (opțional, pentru securitate suplimentară)
Type: TXT
Name: _dmarc
Value: "v=DMARC1; p=quarantine; rua=mailto:postmaster@misedainspectsrl.ro"
```

## 4. 🧪 Testarea Email Service

### Test manual din aplicație:
1. Accesați funcția "Am uitat parola"
2. Introduceți un email de test
3. Verificați că email-ul este primit
4. Verificați că codul funcționează

### Test din terminal pe server:
```bash
node -e "
const { testEmailConnection } = require('./services/emailService');
testEmailConnection().then(result => {
  console.log('Email test result:', result);
}).catch(err => {
  console.error('Email test failed:', err);
});
"
```

## 5. 📊 Monitoring și Logs

### Verificare funcționare:
- Logs în `/var/log/nginx/misedainspectsrl.ro.error.log`
- Application logs în aplicație
- Email delivery reports în cPanel

### Rate limiting pentru securitate:
- Maximum 5 email-uri pe IP pe oră pentru reset password
- Implementat în nginx.conf

## 6. 🚨 Troubleshooting

### Dacă email-urile nu se trimit:
1. **Verificați SMTP credentials**
2. **Testați manual cu telnet**:
   ```bash
   telnet mail.misedainspectsrl.ro 587
   ```
3. **Verificați DNS records**
4. **Checking hosting provider restrictions**

### Backup cu Gmail (dacă hosting email nu funcționează):
```bash
# În .env.production
EMAIL_SERVICE=gmail
GMAIL_USER=your-backup@gmail.com
GMAIL_PASS=your-gmail-app-password
```

## 7. ✅ Checklist Final

- [ ] Cont email `notificari@misedainspectsrl.ro` creat
- [ ] SMTP settings testate
- [ ] DNS records configurate (MX, SPF)
- [ ] `.env.production` actualizat cu credentials
- [ ] Test email trimis și primit
- [ ] Rate limiting configurat
- [ ] Monitoring setup

---

**🎯 Rezultat final**: Email-uri profesionale trimise de pe `notificari@misedainspectsrl.ro` cu design premium și branding Miseda Inspect SRL!
