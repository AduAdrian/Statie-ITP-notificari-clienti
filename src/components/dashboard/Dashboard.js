import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FiPlus, FiEdit, FiLogOut, FiSearch, FiChevronDown, FiChevronUp, FiUpload, FiTrash2, FiDatabase, FiSettings } from 'react-icons/fi';
import ImportData from './ImportData';

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    // Form state
    const [plateNumber, setPlateNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [validity, setValidity] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    
    // List and editing state
    const [notifications, setNotifications] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNotifId, setCurrentNotifId] = useState(null);
    
    // Search and sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'expirationDate', direction: 'ascending' });
    const [showImportModal, setShowImportModal] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Fetch all notifications on component mount
    useEffect(() => {
        // Verifică dacă utilizatorul este autentificat
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            navigate('/');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch (error) {
            console.error('Token invalid:', error);
            localStorage.removeItem('jwtToken');
            navigate('/');
            return;
        }

        fetchNotifications();
    }, [navigate]);

    const fetchNotifications = () => {
        axios.get('http://localhost:5000/api/notifications')
            .then(res => setNotifications(res.data))
            .catch(err => {
                console.log('Eroare la încărcarea notificărilor:', err);
            });
    };

    // Filter and sort notifications
    const sortedAndFilteredNotifications = notifications
        .filter(notif => 
            notif.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notif.phoneNumber.includes(searchTerm)
        )
        .sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

    // Pagination logic
    const totalPages = Math.ceil(sortedAndFilteredNotifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNotifications = sortedAndFilteredNotifications.slice(startIndex, endIndex);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return null;
        }
        if (sortConfig.direction === 'ascending') {
            return <FiChevronUp />;
        }
        return <FiChevronDown />;
    };

    const resetForm = () => {
        setPlateNumber('');
        setPhoneNumber('');
        setValidity('');
        setExpirationDate('');
        setIsEditing(false);
        setCurrentNotifId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let calculatedExpirationDate = expirationDate;
        if (validity !== 'custom' && validity) {
            const now = new Date();
            if (validity === '6m') now.setMonth(now.getMonth() + 6);
            else if (validity === '1y') now.setFullYear(now.getFullYear() + 1);
            else if (validity === '2y') now.setFullYear(now.getFullYear() + 2);
            calculatedExpirationDate = now.toISOString().split('T')[0];
        }

        const notificationData = { plateNumber, phoneNumber, validity, expirationDate: calculatedExpirationDate };

        if (isEditing) {
            // Update existing notification
            axios.put(`http://localhost:5000/api/notifications/${currentNotifId}`, notificationData)
                .then(res => {
                    console.log('Notificare actualizată cu succes');
                    fetchNotifications();
                    resetForm();
                })
                .catch(err => {
                    console.log('Eroare la actualizare:', err.response?.data);
                });
        } else {
            // Add new notification
            axios.post('http://localhost:5000/api/notifications', notificationData)
                .then(res => {
                    console.log('Notificare adăugată cu succes');
                    fetchNotifications();
                    resetForm();
                })
                .catch(err => {
                    console.log('Eroare la adăugare:', err.response?.data);
                });
        }
    };

    const handleEdit = (notification) => {
        setIsEditing(true);
        setCurrentNotifId(notification._id);
        setPlateNumber(notification.plateNumber);
        setPhoneNumber(notification.phoneNumber);
        setValidity(notification.validity);
        const date = new Date(notification.expirationDate);
        const formattedDate = date.toISOString().split('T')[0];
        setExpirationDate(formattedDate);
    };

    const handleDelete = (id) => {
        if (window.confirm('Ești sigur că vrei să ștergi această notificare?')) {
            axios.delete(`http://localhost:5000/api/notifications/${id}`)
                .then(res => {
                    console.log('Notificare ștearsă cu succes');
                    
                    // Calculate new total after deletion
                    const newTotal = sortedAndFilteredNotifications.length - 1;
                    const newTotalPages = Math.ceil(newTotal / itemsPerPage);
                    
                    // If current page becomes empty and it's not the first page, go to previous page
                    if (currentPage > newTotalPages && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    }
                    
                    fetchNotifications();
                })
                .catch(err => {
                    console.log('Eroare la ștergere:', err.response?.data);
                });
        }
    };

    const onLogoutClick = (e) => {
        e.preventDefault();
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('rememberedEmail');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="dashboard-title">
                    <h2>Panou de Control</h2>
                    {user && (
                        <div className="database-badge">
                            <div className="database-dot">
                                <FiDatabase />
                            </div>
                            <span>{user.databaseName}</span>
                            <span className="user-info">• {user.name}</span>
                        </div>
                    )}
                </div>
                <div className="header-actions">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text"
                            placeholder="Caută după număr sau telefon..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setShowImportModal(true)} 
                        className="btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <FiUpload />
                        <span>Import Date</span>
                    </button>
                    <button 
                        onClick={() => navigate('/settings')} 
                        className="btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <FiSettings />
                        <span>Setări</span>
                    </button>
                    <button onClick={onLogoutClick} className="btn-logout">
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="form-card">
                    <h4>{isEditing ? 'Modifică Notificare' : 'Adaugă Notificare Nouă'}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Număr Înmatriculare</label>
                                <input 
                                    type="text" 
                                    value={plateNumber} 
                                    onChange={(e) => setPlateNumber(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Număr Telefon</label>
                                <input 
                                    type="tel" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Setare Rapidă Valabilitate</label>
                                <select value={validity} onChange={(e) => setValidity(e.target.value)}>
                                    <option value="">Selectează...</option>
                                    <option value="6m">6 Luni</option>
                                    <option value="1y">1 An</option>
                                    <option value="2y">2 Ani</option>
                                    <option value="custom">Dată Specifică</option>
                                </select>
                            </div>
                            {validity === 'custom' && (
                                <div className="form-group">
                                    <label>Data Expirării</label>
                                    <input 
                                        type="date" 
                                        value={expirationDate} 
                                        onChange={(e) => setExpirationDate(e.target.value)} 
                                        required 
                                    />
                                </div>
                            )}
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                <FiPlus /> {isEditing ? 'Actualizează' : 'Adaugă'}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={resetForm} className="btn-secondary">
                                    Anulează
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="table-card">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '80px', textAlign: 'center' }}>Numar</th>
                                    <th onClick={() => requestSort('plateNumber')}>
                                        Număr Înmatriculare {getSortIcon('plateNumber')}
                                    </th>
                                    <th onClick={() => requestSort('phoneNumber')}>
                                        Telefon {getSortIcon('phoneNumber')}
                                    </th>
                                    <th onClick={() => requestSort('expirationDate')}>
                                        Data Expirării {getSortIcon('expirationDate')}
                                    </th>
                                    <th onClick={() => requestSort('status')}>
                                        Status {getSortIcon('status')}
                                    </th>
                                    <th>Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentNotifications.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="no-data">
                                            {searchTerm ? 'Nu s-au găsit rezultate pentru căutarea dumneavoastră.' : 'Nu există notificări încă.'}
                                        </td>
                                    </tr>
                                ) : (
                                    currentNotifications.map((notif, index) => (
                                        <tr key={notif._id} data-number={startIndex + index + 1}>
                                            <td data-label="Numar" style={{ textAlign: 'center', fontWeight: 'bold', color: '#007bff', fontSize: '1.1rem' }}>
                                                {startIndex + index + 1}
                                            </td>
                                            <td data-label="Număr">{notif.plateNumber}</td>
                                            <td data-label="Telefon">{notif.phoneNumber}</td>
                                            <td data-label="Expirare">
                                                {new Date(notif.expirationDate).toLocaleDateString('ro-RO')}
                                            </td>
                                            <td data-label="Status">
                                                <span className={`status-badge status-${notif.status ? notif.status.toLowerCase().replace(' ', '-') : 'în-așteptare'}`}>
                                                    {notif.status || 'În așteptare'}
                                                </span>
                                            </td>
                                            <td data-label="Acțiuni" className="action-buttons">
                                                <button 
                                                    onClick={() => handleEdit(notif)} 
                                                    className="btn-icon btn-edit"
                                                    title="Modifică"
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(notif._id)} 
                                                    className="btn-icon btn-delete"
                                                    title="Șterge"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <div className="pagination-info">
                                Afișez {startIndex + 1} - {Math.min(endIndex, sortedAndFilteredNotifications.length)} din {sortedAndFilteredNotifications.length} intrări
                            </div>
                            <div className="pagination">
                                <button 
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="pagination-btn"
                                >
                                    ««
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="pagination-btn"
                                >
                                    ‹
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(pageNum => {
                                        // Show first page, current page and neighbors, last page
                                        return pageNum === 1 || 
                                               pageNum === totalPages || 
                                               Math.abs(pageNum - currentPage) <= 2;
                                    })
                                    .map((pageNum, index, array) => {
                                        // Add ellipsis if there's a gap
                                        const prevPageNum = array[index - 1];
                                        const showEllipsis = prevPageNum && pageNum - prevPageNum > 1;
                                        
                                        return (
                                            <React.Fragment key={pageNum}>
                                                {showEllipsis && <span className="pagination-ellipsis">...</span>}
                                                <button
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            </React.Fragment>
                                        );
                                    })}
                                
                                <button 
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="pagination-btn"
                                >
                                    ›
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="pagination-btn"
                                >
                                    »»
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Import Modal */}
            {showImportModal && (
                <ImportData 
                    onImportSuccess={() => {
                        fetchNotifications();
                        setShowImportModal(false);
                    }}
                    onClose={() => setShowImportModal(false)}
                />
            )}
        </div>
    );
}

export default Dashboard;

