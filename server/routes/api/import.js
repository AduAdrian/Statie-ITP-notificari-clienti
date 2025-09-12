const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Load Notification model
const Notification = require('../../models/Notification');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.csv', '.xlsx', '.xls'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new Error('Doar fișierele CSV și Excel (.xlsx, .xls) sunt permise!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// @route   GET api/import/template/csv
// @desc    Download CSV template
// @access  Public
router.get('/template/csv', (req, res) => {
    try {
        const templatePath = path.join(__dirname, '../../templates/import-template.csv');
        
        if (fs.existsSync(templatePath)) {
            res.download(templatePath, 'import-template.csv', (err) => {
                if (err) {
                    console.error('Error downloading CSV template:', err);
                    res.status(500).json({ error: 'Eroare la descărcarea template-ului CSV' });
                }
            });
        } else {
            res.status(404).json({ error: 'Template-ul CSV nu a fost găsit' });
        }
    } catch (error) {
        console.error('Error serving CSV template:', error);
        res.status(500).json({ error: 'Eroare server' });
    }
});

// @route   GET api/import/template/xlsx
// @desc    Generate and download XLSX template
// @access  Public
router.get('/template/xlsx', (req, res) => {
    try {
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        
        // Sample data with headers
        const wsData = [
            ['plateNumber', 'phoneNumber', 'validity', 'expirationDate', 'status'],
            ['B123ABC', '0721234567', '6 luni', '2025-03-12', 'În așteptare'],
            ['CL456DEF', '0722345678', '1 an', '2025-09-12', 'În așteptare'],
            ['BC789GHI', '0723456789', '2 ani', '2027-09-12', 'În așteptare']
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Set column widths
        ws['!cols'] = [
            { wch: 12 }, // plateNumber
            { wch: 15 }, // phoneNumber
            { wch: 10 }, // validity
            { wch: 15 }, // expirationDate
            { wch: 15 }  // status
        ];
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Import Template');
        
        // Generate buffer
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=import-template.xlsx');
        res.send(buffer);
        
    } catch (error) {
        console.error('Error generating XLSX template:', error);
        res.status(500).json({ error: 'Eroare la generarea template-ului Excel' });
    }
});

// @route   POST api/import/upload
// @desc    Import notifications from CSV/Excel file
// @access  Public
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nu a fost încărcat niciun fișier' });
        }

        const filePath = req.file.path;
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        let data = [];
        let errors = [];
        let successCount = 0;

        // Process based on file type
        if (fileExtension === '.csv') {
            // Process CSV file
            data = await processCSV(filePath);
        } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
            // Process Excel file
            data = processExcel(filePath);
        }

        // Validate and save data
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNumber = i + 2; // +2 because row 1 is header and array is 0-indexed

            try {
                // Validate required fields
                if (!row.plateNumber || !row.phoneNumber || !row.validity || !row.expirationDate) {
                    errors.push(`Rândul ${rowNumber}: Câmpuri obligatorii lipsesc`);
                    continue;
                }

                // Validate phone number format
                if (!/^07\d{8}$/.test(row.phoneNumber)) {
                    errors.push(`Rândul ${rowNumber}: Format telefon invalid (trebuie să înceapă cu 07 și să aibă 10 cifre)`);
                    continue;
                }

                // Validate validity
                const validityOptions = ['6 luni', '1 an', '2 ani'];
                if (!validityOptions.includes(row.validity)) {
                    errors.push(`Rândul ${rowNumber}: Valabilitate invalidă (doar: ${validityOptions.join(', ')})`);
                    continue;
                }

                // Validate date format
                const expDate = new Date(row.expirationDate);
                if (isNaN(expDate.getTime())) {
                    errors.push(`Rândul ${rowNumber}: Format dată invalid (folosiți YYYY-MM-DD)`);
                    continue;
                }

                // Check if plate number already exists
                const existingNotification = await Notification.findOne({ plateNumber: row.plateNumber });
                if (existingNotification) {
                    errors.push(`Rândul ${rowNumber}: Numărul de înmatriculare ${row.plateNumber} există already în baza de date`);
                    continue;
                }

                // Create new notification
                const newNotification = new Notification({
                    plateNumber: row.plateNumber.trim(),
                    phoneNumber: row.phoneNumber.trim(),
                    validity: row.validity.trim(),
                    expirationDate: expDate,
                    status: row.status ? row.status.trim() : 'În așteptare'
                });

                await newNotification.save();
                successCount++;

            } catch (saveError) {
                errors.push(`Rândul ${rowNumber}: ${saveError.message}`);
            }
        }

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        // Send response
        res.json({
            success: true,
            message: `Import finalizat cu succes!`,
            stats: {
                totalRows: data.length,
                successful: successCount,
                errors: errors.length
            },
            errors: errors.length > 0 ? errors : null
        });

    } catch (error) {
        console.error('Import error:', error);
        
        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ 
            error: 'Eroare la procesarea fișierului', 
            details: error.message 
        });
    }
});

// Helper function to process CSV
function processCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

// Helper function to process Excel
function processExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return jsonData;
}

module.exports = router;
