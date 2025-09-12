const XLSX = require('xlsx');
const path = require('path');

// Create a sample XLSX template
function createExcelTemplate() {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Sample data with headers
    const wsData = [
        // Headers
        ['plateNumber', 'phoneNumber', 'validity', 'expirationDate', 'status'],
        // Sample data
        ['B123ABC', '0721234567', '6 luni', '2025-03-12', 'În așteptare'],
        ['CL456DEF', '0722345678', '1 an', '2025-09-12', 'În așteptare'],
        ['BC789GHI', '0723456789', '2 ani', '2027-09-12', 'În așteptare'],
        // Empty rows for user input
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
    ];
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Set column widths
    ws['!cols'] = [
        { wch: 15 }, // plateNumber
        { wch: 15 }, // phoneNumber  
        { wch: 12 }, // validity
        { wch: 15 }, // expirationDate
        { wch: 15 }  // status
    ];
    
    // Style the header row
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1'];
    headerCells.forEach(cell => {
        if (ws[cell]) {
            ws[cell].s = {
                font: { bold: true, color: { rgb: '0a2540' } },
                fill: { fgColor: { rgb: 'E3F2FD' } },
                alignment: { horizontal: 'center' }
            };
        }
    });
    
    // Add data validation (if supported)
    // Note: XLSX.js has limited support for data validation
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Notificari Import');
    
    // Add instructions sheet
    const instructionsData = [
        ['🚀 INSTRUCȚIUNI PENTRU IMPORT'],
        [''],
        ['📋 Câmpuri Obligatorii:'],
        ['• plateNumber: Numărul de înmatriculare (ex: B123ABC)'],
        ['• phoneNumber: Numărul de telefon (format: 07XXXXXXXX)'],
        ['• validity: Perioada valabilității (6 luni, 1 an, 2 ani)'],
        ['• expirationDate: Data expirării (format: YYYY-MM-DD)'],
        ['• status: Statusul notificării (În așteptare, Trimis, Confirmat)'],
        [''],
        ['⚠️ ATENȚIE:'],
        ['• Respectați exact formatele indicate'],
        ['• Nu folosiți caractere speciale în numărul de înmatriculare'],
        ['• Telefonul trebuie să înceapă cu 07 și să aibă 10 cifre'],
        ['• Data trebuie în format YYYY-MM-DD (ex: 2025-09-12)'],
        ['• Pentru valability, folosiți doar: "6 luni", "1 an", "2 ani"'],
        [''],
        ['✅ Exemple Valide:'],
        ['B123ABC | 0721234567 | 1 an | 2025-09-12 | În așteptare'],
        ['CL456DEF | 0722345678 | 6 luni | 2025-03-12 | În așteptare'],
        [''],
        ['📁 După completare:'],
        ['1. Salvați fișierul cu extensia .xlsx'],
        ['2. Folosiți butonul "Import Date" din dashboard'],
        ['3. Selectați fișierul completat'],
        ['4. Verificați rezultatul importului']
    ];
    
    const instructionsWs = XLSX.utils.aoa_to_sheet(instructionsData);
    instructionsWs['!cols'] = [{ wch: 80 }];
    
    // Style instructions header
    if (instructionsWs['A1']) {
        instructionsWs['A1'].s = {
            font: { bold: true, size: 16, color: { rgb: '0a2540' } },
            alignment: { horizontal: 'center' }
        };
    }
    
    XLSX.utils.book_append_sheet(wb, instructionsWs, 'Instrucțiuni');
    
    // Write file
    const filePath = path.join(__dirname, 'import-template.xlsx');
    XLSX.writeFile(wb, filePath);
    
    console.log('Excel template created at:', filePath);
}

// Run the function
createExcelTemplate();
