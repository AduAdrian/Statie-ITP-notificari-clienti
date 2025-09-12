import React, { useState } from 'react';
import axios from 'axios';
import { FiDownload, FiRefreshCw, FiCheckCircle, FiAlertCircle, FiX, FiUser, FiPhone, FiCalendar, FiTruck } from 'react-icons/fi';
import config from '../../config/config';

const PullRequests = ({ onImportSuccess, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);
    const [selectedRequests, setSelectedRequests] = useState(new Set());
    const [pullResult, setPullResult] = useState(null);
    const [importing, setImporting] = useState(false);

    const handlePullRequests = async () => {
        setLoading(true);
        setPullResult(null);
        setRequests([]);
        setSelectedRequests(new Set());

        try {
            // Make API call to pull requests from ITP station
            const response = await axios.get(`${config.API_BASE_URL}/stations/pull-requests`);
            
            if (response.data.success) {
                setRequests(response.data.requests || []);
                setPullResult({
                    success: true,
                    message: `Au fost găsite ${response.data.requests?.length || 0} cereri noi de notificare`,
                    count: response.data.requests?.length || 0
                });
            } else {
                setPullResult({
                    success: false,
                    message: response.data.message || 'Nu s-au găsit cereri noi'
                });
            }
        } catch (error) {
            console.error('Eroare la extragerea cererilor:', error);
            setPullResult({
                success: false,
                message: error.response?.data?.message || 'Eroare la conectarea cu stația ITP'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSelectRequest = (requestId) => {
        const newSelected = new Set(selectedRequests);
        if (newSelected.has(requestId)) {
            newSelected.delete(requestId);
        } else {
            newSelected.add(requestId);
        }
        setSelectedRequests(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedRequests.size === requests.length) {
            setSelectedRequests(new Set());
        } else {
            setSelectedRequests(new Set(requests.map(req => req.id)));
        }
    };

    const handleImportSelected = async () => {
        if (selectedRequests.size === 0) {
            alert('Te rog selectează cel puțin o cerere pentru import');
            return;
        }

        setImporting(true);

        try {
            const selectedData = requests.filter(req => selectedRequests.has(req.id));
            
            // Transform data to match notification format
            const notificationsData = selectedData.map(req => ({
                plateNumber: req.plateNumber,
                phoneNumber: req.phoneNumber,
                validity: req.suggestedValidity || '1y',
                expirationDate: req.suggestedExpirationDate,
                source: 'ITP_STATION_PULL',
                originalRequestId: req.id,
                clientName: req.clientName,
                requestDate: req.requestDate
            }));

            const response = await axios.post(`${config.API_BASE_URL}/notifications/bulk-import`, {
                notifications: notificationsData
            });

            if (response.data.success) {
                setPullResult({
                    success: true,
                    message: `${selectedRequests.size} cereri au fost importate cu succes în sistem`,
                    imported: true
                });
                
                if (onImportSuccess) {
                    onImportSuccess();
                }
                
                // Clear selected requests after successful import
                setSelectedRequests(new Set());
            }
        } catch (error) {
            console.error('Eroare la importul cererilor:', error);
            setPullResult({
                success: false,
                message: error.response?.data?.message || 'Eroare la importul cererilor selectate'
            });
        } finally {
            setImporting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('ro-RO');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content pull-requests-modal">
                <div className="modal-header">
                    <h2><FiDownload /> Extrage Cereri de la Stația ITP</h2>
                    <button className="modal-close" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Pull Action Section */}
                    <div className="pull-action-section">
                        <div className="pull-info">
                            <h3>Extrage Cereri Noi</h3>
                            <p>Conectează-te la stația ITP pentru a extrage cererile noi de notificare ale clienților.</p>
                        </div>
                        <button 
                            className="btn btn-primary"
                            onClick={handlePullRequests}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FiRefreshCw className="spinning" />
                                    Se conectează...
                                </>
                            ) : (
                                <>
                                    <FiDownload />
                                    Extrage Cereri
                                </>
                            )}
                        </button>
                    </div>

                    {/* Pull Results */}
                    {pullResult && (
                        <div className={`pull-result ${pullResult.success ? 'success' : 'error'}`}>
                            {pullResult.success ? (
                                <FiCheckCircle className="result-icon" />
                            ) : (
                                <FiAlertCircle className="result-icon" />
                            )}
                            <span>{pullResult.message}</span>
                        </div>
                    )}

                    {/* Requests List */}
                    {requests.length > 0 && (
                        <div className="requests-section">
                            <div className="requests-header">
                                <h4>Cereri Găsite ({requests.length})</h4>
                                <div className="bulk-actions">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={selectedRequests.size === requests.length && requests.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                        Selectează toate
                                    </label>
                                    <button
                                        className="btn btn-outline"
                                        onClick={handleImportSelected}
                                        disabled={selectedRequests.size === 0 || importing}
                                    >
                                        {importing ? 'Se importă...' : `Importă selectate (${selectedRequests.size})`}
                                    </button>
                                </div>
                            </div>

                            <div className="requests-list">
                                {requests.map((request) => (
                                    <div 
                                        key={request.id}
                                        className={`request-card ${selectedRequests.has(request.id) ? 'selected' : ''}`}
                                    >
                                        <div className="request-header">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRequests.has(request.id)}
                                                    onChange={() => handleSelectRequest(request.id)}
                                                />
                                                <span className="request-id">#{request.id}</span>
                                            </label>
                                            <span className="request-date">
                                                <FiCalendar />
                                                {formatDate(request.requestDate)}
                                            </span>
                                        </div>

                                        <div className="request-details">
                                            <div className="detail-item">
                                                <FiUser />
                                                <span><strong>Client:</strong> {request.clientName || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <FiTruck />
                                                <span><strong>Număr:</strong> {request.plateNumber}</span>
                                            </div>
                                            <div className="detail-item">
                                                <FiPhone />
                                                <span><strong>Telefon:</strong> {request.phoneNumber}</span>
                                            </div>
                                            {request.suggestedExpirationDate && (
                                                <div className="detail-item">
                                                    <FiCalendar />
                                                    <span><strong>Expirare sugerate:</strong> {formatDate(request.suggestedExpirationDate)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {request.notes && (
                                            <div className="request-notes">
                                                <strong>Observații:</strong> {request.notes}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose}>
                        Închide
                    </button>
                    {requests.length > 0 && selectedRequests.size > 0 && (
                        <button 
                            className="btn btn-primary"
                            onClick={handleImportSelected}
                            disabled={importing}
                        >
                            {importing ? 'Se importă...' : `Importă ${selectedRequests.size} cereri`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PullRequests;