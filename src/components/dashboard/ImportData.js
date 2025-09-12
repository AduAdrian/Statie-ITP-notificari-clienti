import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiDownload, FiFileText, FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

const ImportData = ({ onImportSuccess, onClose }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (selectedFile) => {
        const allowedTypes = ['.csv', '.xlsx', '.xls'];
        const fileExtension = selectedFile.name.toLowerCase();
        const isValidType = allowedTypes.some(type => fileExtension.endsWith(type));
        
        if (isValidType) {
            setFile(selectedFile);
            setUploadResult(null);
        } else {
            alert('Doar fișierele CSV și Excel (.xlsx, .xls) sunt permise!');
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const downloadTemplate = async (format) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/import/template/${format}`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `import-template.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading template:', error);
            alert('Eroare la descărcarea template-ului');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Te rog selectează un fișier pentru import');
            return;
        }

        setUploading(true);
        setUploadResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/import/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUploadResult(response.data);
            
            if (response.data.success && onImportSuccess) {
                onImportSuccess();
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadResult({
                success: false,
                error: error.response?.data?.error || 'Eroare la încărcarea fișierului'
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content import-modal">
                <div className="modal-header">
                    <h2><FiUpload /> Import Date în Bulk</h2>
                    <button className="modal-close" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Download Templates Section */}
                    <div className="template-section">
                        <h3><FiDownload /> Descarcă Template</h3>
                        <p>Descarcă template-ul pentru a vedea formatul corect de import:</p>
                        <div className="template-buttons">
                            <button 
                                className="btn btn-outline"
                                onClick={() => downloadTemplate('csv')}
                            >
                                <FiFileText /> Template CSV
                            </button>
                            <button 
                                className="btn btn-outline"
                                onClick={() => downloadTemplate('xlsx')}
                            >
                                <FiFileText /> Template Excel
                            </button>
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="upload-section">
                        <h3><FiUpload /> Încarcă Fișierul</h3>
                        
                        <div 
                            className={`drop-zone ${dragActive ? 'active' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {file ? (
                                <div className="file-selected">
                                    <FiFileText className="file-icon" />
                                    <span>{file.name}</span>
                                    <button 
                                        className="btn btn-sm btn-outline"
                                        onClick={() => setFile(null)}
                                    >
                                        <FiX /> Șterge
                                    </button>
                                </div>
                            ) : (
                                <div className="drop-zone-content">
                                    <FiUpload className="upload-icon" />
                                    <p>Trage și lasă fișierul aici sau</p>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => document.getElementById('file-input').click()}
                                    >
                                        Selectează Fișier
                                    </button>
                                    <p className="file-info">CSV, Excel (.xlsx, .xls) - max 5MB</p>
                                </div>
                            )}
                        </div>

                        <input
                            id="file-input"
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileInputChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {/* Upload Results */}
                    {uploadResult && (
                        <div className="upload-result">
                            {uploadResult.success ? (
                                <div className="success-result">
                                    <FiCheckCircle className="success-icon" />
                                    <h4>Import Reușit!</h4>
                                    <div className="stats">
                                        <p><strong>Total rânduri:</strong> {uploadResult.stats.totalRows}</p>
                                        <p><strong>Importate cu succes:</strong> {uploadResult.stats.successful}</p>
                                        <p><strong>Erori:</strong> {uploadResult.stats.errors}</p>
                                    </div>
                                    
                                    {uploadResult.errors && uploadResult.errors.length > 0 && (
                                        <div className="errors-section">
                                            <h5>⚠️ Erori encontre:</h5>
                                            <div className="errors-list">
                                                {uploadResult.errors.slice(0, 10).map((error, index) => (
                                                    <p key={index} className="error-item">{error}</p>
                                                ))}
                                                {uploadResult.errors.length > 10 && (
                                                    <p className="error-item">... și {uploadResult.errors.length - 10} erori în plus</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="error-result">
                                    <FiAlertCircle className="error-icon" />
                                    <h4>Eroare la Import</h4>
                                    <p>{uploadResult.error}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button 
                        className="btn btn-outline"
                        onClick={onClose}
                    >
                        Anulează
                    </button>
                    <button 
                        className="btn btn-primary"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                    >
                        {uploading ? 'Se încarcă...' : 'Import Date'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportData;
