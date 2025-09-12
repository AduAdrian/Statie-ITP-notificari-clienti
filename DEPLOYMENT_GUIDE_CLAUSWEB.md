# DEPLOYMENT GUIDE - misedainspectsrl.ro

## 📋 PAȘI PENTRU UPLOADUL PE CLAUSWEB

### 1. PREGĂTIREA FIȘIERELOR

**Frontend (Site-ul):**
- Toate fișierele din `client/build/` trebuie urcate în `public_html/`
- Include: index.html, static/, .htaccess, favicon.ico, etc.

**Backend (API-ul):**
- Fișierele din `server/` trebuie urcate într-un director separat (ex: `api/`)
- Include: index.js, package.json, config/, models/, routes/, etc.

### 2. ACCESAREA PANOULUI CLAUSWEB

1. Logează-te pe ClausWeb.ro
2. Mergi la **File Manager** sau **Managerul de fișiere**
3. Navighează la directorul `public_html/`

### 3. UPLOADUL FRONTEND-ULUI

1. **Șterge conținutul existent din `public_html/`** (dacă există)
2. **Uploadează tot conținutul din `client/build/`:**
   - index.html
   - favicon.ico
   - manifest.json
   - robots.txt
   - .htaccess
   - static/ (întreg directorul)

### 4. UPLOADUL BACKEND-ULUI

1. Creează un director `api/` în `public_html/`
2. Uploadează toate fișierele din `server/` în `public_html/api/`:
   - index.js
   - package.json
   - config/
   - models/
   - routes/
   - services/
   - .env.production (redenumește în .env)

### 5. CONFIGURAREA EMAILULUI

1. În panoul ClausWeb, mergi la **Email Accounts**
2. Creează contul: `notificari@misedainspectsrl.ro`
3. Setează o parolă puternică
4. Actualizează fișierul `.env` cu:
   - EMAIL_USER=notificari@misedainspectsrl.ro
   - EMAIL_PASS=parola_ta_aici

### 6. CONFIGURAREA BAZEI DE DATE

1. În panoul ClausWeb, mergi la **MySQL Databases**
2. Creează o bază de date (ex: `miseda_notifications`)
3. Creează un utilizator și adaugă-l la baza de date
4. Actualizează `.env` cu datele MongoDB/MySQL

### 7. ACTIVAREA NODE.JS

1. În panoul ClausWeb, caută opțiunea **Node.js Apps**
2. Activează Node.js pentru domeniu
3. Setează directorul aplicației la `public_html/api/`
4. Instalează dependențele cu `npm install`

### 8. VERIFICAREA FUNCȚIONALITĂȚII

**Site-ul:** https://misedainspectsrl.ro
**API:** https://misedainspectsrl.ro/api/users/test

---

## 🔧 FIȘIERE IMPORTANTE

- **Frontend:** `client/build/` → `public_html/`
- **Backend:** `server/` → `public_html/api/`
- **Config:** `.env.production` → `.env`
- **Routing:** `.htaccess` (pentru React Router)

## 📧 EMAIL PROFESIONAL

**Cont:** notificari@misedainspectsrl.ro  
**Funcții:** 
- Trimitere notificări ITP
- Resetare parole
- Comunicări oficiale Miseda Inspect SRL

## 🚀 POST-DEPLOYMENT

După upload, verifică:
- [ ] Site-ul se încarcă: https://misedainspectsrl.ro
- [ ] Login funcționează
- [ ] Dashboard este accesibil
- [ ] Email-urile de resetare parole se trimit
- [ ] Toate funcționalitățile premium funcționează
