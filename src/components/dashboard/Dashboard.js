import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    // Form state
    const [plateNumber, setPlateNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [validity, setValidity] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    
    // List and editing state
    const [notifications, setNotifications] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNotifId, setCurrentNotifId] = useState(null);

    // Fetch all notifications on component mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = () => {
        axios.get('http://localhost:5000/api/notifications')
            .then(res => setNotifications(res.data))
            .catch(err => console.log(err));
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
                    fetchNotifications(); // Refresh list
                    resetForm();
                })
                .catch(err => console.log(err.response.data));
        } else {
            // Add new notification
            axios.post('http://localhost:5000/api/notifications', notificationData)
                .then(res => {
                    fetchNotifications(); // Refresh list
                    resetForm();
                })
                .catch(err => console.log(err.response.data));
        }
    };

    const handleEdit = (notification) => {
        setIsEditing(true);
        setCurrentNotifId(notification._id);
        setPlateNumber(notification.plateNumber);
        setPhoneNumber(notification.phoneNumber);
        setValidity(notification.validity);
        // For date, we need to format it correctly for the input[type=date]
        const date = new Date(notification.expirationDate);
        const formattedDate = date.toISOString().split('T')[0];
        setExpirationDate(formattedDate);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/notifications/${id}`)
            .then(res => {
                fetchNotifications(); // Refresh list
            })
            .catch(err => console.log(err.response.data));
    };

    const onLogoutClick = e => {
        e.preventDefault();
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('rememberedEmail'); // Also clear remembered email
        window.location.href = '/login';
    };

    return (
        <div className="container">
            <div className="row" style={{ marginTop: '2rem' }}>
                <div className="col s12 center-align">
                    <h3>Miseda Inspect SRL - BAZA DE DATE NOTIFICARE ITP</h3>
                    <button
                        onClick={onLogoutClick}
                        className="btn waves-effect waves-light red"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Form for Adding/Editing */}
            <div className="row">
                <div className="col s12">
                    <form onSubmit={handleSubmit}>
                        <h5>{isEditing ? 'Editare Înregistrare' : 'Adăugare Înregistrare Nouă'}</h5>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="plateNumber" type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} required />
                                <label htmlFor="plateNumber" className={plateNumber ? 'active' : ''}>Număr Înmatriculare</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                                <label htmlFor="phoneNumber" className={phoneNumber ? 'active' : ''}>Număr de Telefon</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <select className="browser-default" value={validity} onChange={(e) => setValidity(e.target.value)} required>
                                    <option value="" disabled>Alege Valabilitate</option>
                                    <option value="6m">6 Luni</option>
                                    <option value="1y">1 An</option>
                                    <option value="2y">2 Ani</option>
                                    <option value="custom">Dată specifică</option>
                                </select>
                            </div>
                            {validity === 'custom' && (
                                <div className="input-field col s6">
                                    <input id="expirationDate" type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} required />
                                    <label htmlFor="expirationDate" className="active">Data Expirării</label>
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn waves-effect waves-light">
                            {isEditing ? 'Actualizează' : 'Adaugă'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={resetForm} className="btn grey" style={{ marginLeft: '10px' }}>
                                Anulează
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Display List */}
            <div className="row" style={{ marginTop: '2rem' }}>
                <div className="col s12">
                    <h4>Înregistrări Active</h4>
                    <table className="striped">
                        <thead>
                            <tr>
                                <th>Nr. Înmatriculare</th>
                                <th>Nr. Telefon</th>
                                <th>Expiră la</th>
                                <th>Status</th>
                                <th>Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map(notification => (
                                <tr key={notification._id}>
                                    <td>{notification.plateNumber}</td>
                                    <td>{notification.phoneNumber}</td>
                                    <td>{new Date(notification.expirationDate).toLocaleDateString()}</td>
                                    <td>{notification.status}</td>
                                    <td>
                                        <button onClick={() => handleEdit(notification)} className="btn-small waves-effect waves-light blue" style={{ marginRight: '5px' }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(notification._id)} className="btn-small waves-effect waves-light red">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

