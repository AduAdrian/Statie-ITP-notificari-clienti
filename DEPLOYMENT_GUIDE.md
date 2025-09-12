# 🚀 DEPLOYMENT GUIDE - misedainspectsrl.ro

## 🎯 Status Actual
✅ **Aplicație gata pentru production**  
✅ **Build React generat**  
✅ **Email service configurat pentru notificari@misedainspectsrl.ro**  
✅ **Nginx configuration preparată**  
✅ **PM2 configuration setup**  

---

## 🌐 1. UPLOAD PE SERVER

### Fișierele de urcat pe server:
```bash
# React Build (statice)
client/build/ → /var/www/misedainspectsrl.ro/client/build/

# Server Node.js
server/ → /var/www/misedainspectsrl.ro/server/

# Configurații
deployment/nginx.conf → /etc/nginx/sites-available/misedainspectsrl.ro
deployment/ecosystem.config.js → /var/www/misedainspectsrl.ro/
deployment/.env.production → /var/www/misedainspectsrl.ro/server/.env
```

---

## 📧 2. CONFIGURARE EMAIL

### A. Creare cont email în cPanel:
1. **Email Accounts** → **Create**
2. **Email**: `notificari@misedainspectsrl.ro`
3. **Password**: Parolă puternică
4. **Quota**: 1GB+

### B. Testare SMTP:
```bash
# Settings pentru test
Host: mail.misedainspectsrl.ro
Port: 587 (TLS) / 465 (SSL)  
User: notificari@misedainspectsrl.ro
Pass: parola-creata
```

### C. Update .env pe server:
```bash
EMAIL_HOST=mail.misedainspectsrl.ro
EMAIL_PORT=587
EMAIL_USER=notificari@misedainspectsrl.ro
EMAIL_PASS=parola-din-cpanel
```

---

## 🔧 3. COMENZILE DE DEPLOYMENT

### Pe server (Ubuntu/Debian):

```bash
# 1. Instalare dependențe
sudo apt update
sudo apt install nginx nodejs npm mongodb-server pm2 -g

# 2. Creare directoare
sudo mkdir -p /var/www/misedainspectsrl.ro
sudo chown -R www-data:www-data /var/www/misedainspectsrl.ro

# 3. Upload fișiere (de pe local)
scp -r client/build/ user@misedainspectsrl.ro:/var/www/misedainspectsrl.ro/client/
scp -r server/ user@misedainspectsrl.ro:/var/www/misedainspectsrl.ro/

# 4. Configurare Nginx
sudo ln -s /etc/nginx/sites-available/misedainspectsrl.ro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 5. Start aplicație cu PM2
cd /var/www/misedainspectsrl.ro
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## 🛡️ 4. SSL CERTIFICATE (Let's Encrypt)

```bash
# Instalare Certbot
sudo apt install certbot python3-certbot-nginx

# Obținere certificat SSL
sudo certbot --nginx -d misedainspectsrl.ro -d www.misedainspectsrl.ro

# Auto-renewal
sudo crontab -e
# Adaugă: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 5. VERIFICARE FUNCȚIONARE

### A. Status servicii:
```bash
sudo systemctl status nginx
sudo systemctl status mongodb
pm2 status
pm2 logs miseda-notificari-api
```

### B. Test aplicație:
- **Frontend**: https://misedainspectsrl.ro
- **API**: https://misedainspectsrl.ro/api/users/test  
- **Email**: Test "Am uitat parola"

### C. Logs monitoring:
```bash
# Nginx logs
tail -f /var/log/nginx/misedainspectsrl.ro.access.log
tail -f /var/log/nginx/misedainspectsrl.ro.error.log

# PM2 logs  
pm2 logs miseda-notificari-api --lines 100
```

---

## 🎯 6. POST-DEPLOYMENT CHECKLIST

- [ ] **SSL Certificate** activat și funcțional
- [ ] **Email notificari@misedainspectsrl.ro** funcționează  
- [ ] **Login/Register** funcționează
- [ ] **"Am uitat parola"** trimite email-uri
- [ ] **SMS notifications** funcționează
- [ ] **Database** conectat și funcțional
- [ ] **File uploads** funcționează
- [ ] **Performance** optimizat (Gzip, caching)

---

## 🚨 7. BACKUP & MAINTENANCE

### Backup automat:
```bash
# Script backup zilnic
#!/bin/bash
mongodump --db notificari-miseda-prod --out /var/backups/mongodb/$(date +%Y%m%d)
tar -czf /var/backups/app/app-$(date +%Y%m%d).tar.gz /var/www/misedainspectsrl.ro
```

### Updates aplicație:
```bash
# Update code
cd /var/www/misedainspectsrl.ro
git pull origin main
npm install --production
pm2 restart miseda-notificari-api
```

---

## 🎉 REZULTAT FINAL

**✅ Aplicație Premium Completă pe misedainspectsrl.ro:**

🔐 **Autentificare completă** cu conturi personale  
📱 **SMS notifications** cu API existent  
📧 **Email profesionale** de pe notificari@misedainspectsrl.ro  
🎨 **Design premium** cu branding Miseda Inspect SRL  
🚀 **Performance optimizat** cu Nginx + PM2  
🛡️ **Securitate SSL** cu Let's Encrypt  

**🎯 Aplicația ta de 10,000 EUR este gata pentru producție!** 🚀
