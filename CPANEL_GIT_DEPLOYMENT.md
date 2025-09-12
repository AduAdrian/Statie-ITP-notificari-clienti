# Git Deployment pentru NotificARI pe ClausWeb

## Configurare Git Deployment în cPanel

### 1. Activare Git Deployment
1. Accesează cPanel la misedainspectsrl.ro
2. Navighează la secțiunea "Git™ Version Control"
3. Creează un nou repository sau folosește cel existent
4. Setează URL-ul repository-ului: `https://github.com/AduAdrian/Statie-ITP-notificari-clienti.git`

### 2. Fișierul .cpanel.yml
Acest fișier configurează deployment-ul automat și execută următoarele task-uri:

- **Curăță directorul** de deployment
- **Copiază server files** din repository în `/home/misedain/public_html/server/`
- **Instalează dependențele** Node.js pentru server (doar production)
- **Copiază configurația** `.env.production` ca `.env`
- **Build-ează aplicația React** din directorul `client/`
- **Deploy-ează build-ul React** în root-ul public_html
- **Setează permisiuni** corecte pentru toate fișierele
- **Creează script de start** pentru serverul Node.js

### 3. Structura de Deployment

```
/home/misedain/public_html/
├── index.html              # React App (build)
├── static/                 # Assets React
├── manifest.json           # PWA manifest
├── server/                 # Node.js Backend
│   ├── index.js           # Server principal
│   ├── models/            # Modele MongoDB
│   ├── routes/            # API routes
│   ├── services/          # Email & SMS services
│   ├── .env               # Config production (din .env.production)
│   └── node_modules/      # Dependencies
├── start_server.sh        # Script pornire server
└── deployment.log         # Log deployment
```

### 4. Variabile de Mediu

Fișierul `.env.production` conține:
```bash
# Database
MONGO_URI=mongodb://localhost:27017/notificari

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_HOST=mail.misedainspectsrl.ro
EMAIL_PORT=587
EMAIL_USER=notificari-sms@misedainspectsrl.ro
EMAIL_PASS=Kreator1234!

# SMS Configuration
SMS_API_URL=your-sms-api-url
SMS_API_KEY=your-sms-api-key

# Frontend URL (for password reset links)
FRONTEND_URL=https://misedainspectsrl.ro
```

### 5. Deployment Process

#### Automatic (prin cPanel Git)
1. Push changes la GitHub repository
2. În cPanel Git, click pe "Update from Remote"
3. Click pe "Deploy HEAD Commit"
4. Urmărește log-urile pentru erori

#### Manual (prin SSH/Terminal)
```bash
cd /home/misedain/public_html/
./start_server.sh &
```

### 6. Verificare Deployment

#### Frontend (React App)
- Accesează: `https://misedainspectsrl.ro`
- Verifică că se încarcă aplicația React
- Testează login/register

#### Backend (Node.js API)
- Testează: `https://misedainspectsrl.ro/api/users/test`
- Verifică că serverul răspunde la API calls

#### Email & SMS Services
- Testează "Forgot Password" functionality
- Verifică că email-urile se trimit corect

### 7. Troubleshooting

#### Deployment Fails
1. Verifică log-urile în cPanel Git
2. Verifică permisiunile fișierelor
3. Verifică că Node.js versiunea 18 este disponibilă

#### Server Nu Pornește
```bash
cd /home/misedain/public_html/server
/home/misedain/nodevenv/public_html/18/bin/node index.js
```

#### Database Connection Issues
- Verifică MongoDB connection string în `.env`
- Asigură-te că MongoDB este accesibil

#### Email Issues
- Verifică credențialele SMTP în `.env`
- Testează conexiunea email manual

### 8. Paths Important

- **Node.js Binary**: `/home/misedain/nodevenv/public_html/18/bin/node`
- **NPM Binary**: `/home/misedain/nodevenv/public_html/18/bin/npm`
- **Public HTML**: `/home/misedain/public_html/`
- **Repository**: `/home/misedain/repositories/Statie-ITP-notificari-clienti/`

### 9. Log Files

- **Deployment Log**: `/home/misedain/public_html/deployment.log`
- **Server Log**: Check console output când rulezi manual
- **cPanel Git Log**: Available în interfața cPanel

### 10. Post-Deployment

După fiecare deployment:
1. Verifică că fișierele sunt copiate corect
2. Restart serverul Node.js
3. Testează functionality critical (login, email, SMS)
4. Verifică performance și erori

---

## Support

Pentru probleme de deployment:
1. Verifică log-urile cPanel Git
2. Verifică `deployment.log`
3. Testează manual comenzile din `.cpanel.yml`