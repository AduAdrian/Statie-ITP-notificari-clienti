# 📊 Import Template pentru Baza de Date

Funcționalitatea de import în bulk permite încărcarea rapidă a datelor pentru notificările vehiculelor în aplicația premium.

## � Fișiere Disponibile

### 📋 Template CSV
- **Fișier**: `import-template.csv`
- **Format**: Comma-separated values
- **Compatibilitate**: Excel, Google Sheets, orice editor CSV

### 📊 Template Excel
- **Fișier**: `import-template.xlsx`
- **Format**: Excel Workbook
- **Foile**: Notificari Import + Instrucțiuni complete
- **Caracteristici**: Formatare profesională, validări, exemple

## 🏗️ Structura Câmpurilor

| Câmp | Tip | Obligatoriu | Validare | Exemplu |
|------|-----|-------------|----------|---------|
| `plateNumber` | Text | ✅ | Unic în sistem, max 10 caractere | `B123ABC` |
| `phoneNumber` | Text | ✅ | Format: `07XXXXXXXX` | `0721234567` |
| `validity` | Select | ✅ | `6 luni`, `1 an`, `2 ani` | `1 an` |
| `expirationDate` | Date | ✅ | Format: `YYYY-MM-DD` | `2025-09-12` |
| `status` | Text | ❌ | `În așteptare`, `Trimis`, `Confirmat` | `În așteptare` |

## ⚠️ Reguli de Validare

### 📱 Număr Telefon
```
✅ Format valid: 0721234567, 0722345678, 0733456789
❌ Format invalid: +40721234567, 721234567, 123456789
```

### 🚗 Număr Înmatriculare
```
✅ Exemple valide: B123ABC, CL456DEF, BC789GHI
❌ Caractere interzise: @#$%^&*()+=
❌ Duplicate în sistem nu sunt permise
```

### ⏰ Valabilitate
```
✅ Opțiuni permise:
- "6 luni" - adaugă 6 luni de la data curentă
- "1 an" - adaugă 1 an de la data curentă  
- "2 ani" - adaugă 2 ani de la data curentă
❌ Alte valori: "3 ani", "6m", "1y" nu sunt acceptate
```

### 📅 Data Expirării
```
✅ Format corect: YYYY-MM-DD (2025-09-12)
❌ Formate greșite: 12/09/2025, 12-09-2025, 09/12/25
```

## � Cum să Folosești Import-ul

### Pasul 1: Descărcare Template
1. Intră în Dashboard
2. Click pe butonul "Import Date"
3. Descarcă template-ul preferat (CSV sau Excel)

### Pasul 2: Completarea Datelor
1. Deschide template-ul în aplicația ta preferată
2. Completează datele respectând validările
3. Salvează fișierul (păstrează formatul original)

### Pasul 3: Import Date
1. În Dashboard, click "Import Date"
2. Selectează fișierul completat
3. Click "Import Date" și așteaptă procesarea

## 📊 Rezultate Import

### ✅ Import Reușit
- **Statistici**: Total rânduri, importate cu succes, erori
- **Notificări**: Noile înregistrări apar imediat în tabel
- **Raport**: Detalii despre fiecare problemă găsită

### ❌ Managementul Erorilor
Import-ul continuă chiar dacă unele rânduri au erori:
- Rândurile corecte se salvează în baza de date
- Rândurile cu probleme sunt raportate cu explicații
- Nu se pierd datele valide din cauza unor erori

## 📋 Exemple de Import

### ✅ Fișier CSV Valid
```csv
plateNumber,phoneNumber,validity,expirationDate,status
B123ABC,0721234567,6 luni,2025-03-12,În așteptare
CL456DEF,0722345678,1 an,2025-09-12,În așteptare
BC789GHI,0723456789,2 ani,2027-09-12,Trimis
```

### ❌ Exemple de Erori Comune

#### Telefon Invalid
```csv
BC123ABC,123456789,1 an,2025-09-12,În așteptare
# Eroare: Format telefon invalid (trebuie să înceapă cu 07)
```

#### Valabilitate Incorectă
```csv
CL456DEF,0721234567,3 ani,2025-09-12,În așteptare
# Eroare: Valabilitate invalidă (doar: 6 luni, 1 an, 2 ani)
```

#### Duplicate
```csv
B123ABC,0721234567,1 an,2025-09-12,În așteptare
B123ABC,0722345678,2 ani,2026-09-12,În așteptare
# Eroare pe al doilea rând: Numărul B123ABC există deja
```

## 🔧 Caracteristici Tehnice

### 🛡️ Securitate
- Validare server-side pentru toate câmpurile
- Protecție împotriva duplicatelor
- Limitare dimensiune fișier: 5MB
- Tipuri fișiere acceptate: CSV, XLSX, XLS

### ⚡ Performance
- Procesare în batch pentru fișiere mari
- Raportare detalită a progresului
- Oprire automată a upload-ului în caz de erori majore
- Curățare automată a fișierelor temporare

### � Integrare
- Refresh automat al dashboard-ului după import
- Notificare în timp real a rezultatelor
- Compatibilitate cu sistemul de notificări existent

## 💡 Tips pentru Import Reușit

1. **📝 Verifică datele înainte de import**
   - Asigură-te că toate câmpurile obligatorii sunt completate
   - Verifică formatul numerelor de telefon
   - Controlează datele de expirare

2. **🧪 Testează cu date mici**
   - Încearcă primul import cu 3-5 rânduri
   - Verifică rezultatele în dashboard
   - Apoi procedează cu datele complete

3. **💾 Păstrează backup-uri**
   - Salvează o copie a datelor originale
   - Exportă datele existente înainte de import masiv
   - Folosește Git pentru versioning

4. **🎯 Optimizează pentru eficiență**
   - Sortează datele după data expirării
   - Grupează după status pentru mai bună organizare
   - Elimină rândurile goale din mijlocul fișierului

## 📞 Support

Pentru probleme cu import-ul:
1. Verifică console-ul browser-ului pentru erori JavaScript
2. Controlează log-urile server-ului
3. Asigură-te că MongoDB este conectat
4. Verifică spațiul disponibil pe disk

---

*🚀 Funcționalitate implementată pentru aplicația premium de 10.000 EUR*
*📅 Ultima actualizare: Septembrie 2025*
