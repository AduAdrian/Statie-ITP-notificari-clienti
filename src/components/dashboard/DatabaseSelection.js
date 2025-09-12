import React, { useState } from 'react';
import { FiDatabase, FiUsers, FiHardDrive, FiFile } from 'react-icons/fi';
import Login from '../auth/Login';
import Dashboard from './Dashboard';

function DatabaseSelection() {
    const [selectedDatabase, setSelectedDatabase] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Lista bazelor de date disponibile cu tipurile lor
    const databases = [
        {
            id: 'statie_itp_main',
            name: 'Stația ITP Principală',
            description: 'Baza de date MongoDB pentru notificări ITP (necesită server)',
            icon: <FiDatabase />,
            color: '#007bff',
            users: 145,
            type: 'MongoDB',
            status: 'online',
            requiresServer: true,
            features: ['Performanță ridicată', 'Scalabilitate', 'Backup automat']
        },
        {
            id: 'statie_itp_secondary',
            name: 'Stația ITP Secundară', 
            description: 'Baza de date SQLite locală (funcționează offline)',
            icon: <FiHardDrive />,
            color: '#28a745',
            users: 78,
            type: 'SQLite',
            status: 'offline',
            requiresServer: false,
            features: ['Funcționare offline', 'Fără server necesar', 'Portabilitate']
        },
        {
            id: 'statie_itp_archive',
            name: 'Arhiva ITP',
            description: 'Stocare în fișiere JSON (simplu, fără dependencies)',
            icon: <FiFile />,
            color: '#6c757d',
            users: 23,
            type: 'JSON Files',
            status: 'offline',
            requiresServer: false,
            features: ['Foarte simplu', 'Fără dependencies', 'Ușor de backup']
        }
    ];

    const handleDatabaseSelect = (database) => {
        setSelectedDatabase(database);
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setCurrentUser(userData);
        // Aici poți salva și database-ul selectat în localStorage
        localStorage.setItem('selectedDatabase', JSON.stringify(selectedDatabase));
        localStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setSelectedDatabase(null);
        localStorage.removeItem('selectedDatabase');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('rememberedEmail');
    };

    const goBackToSelection = () => {
        setSelectedDatabase(null);
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    // Dacă utilizatorul este autentificat și a selectat o bază de date, afișează Dashboard
    if (isAuthenticated && selectedDatabase) {
        return <Dashboard 
            database={selectedDatabase} 
            user={currentUser} 
            onLogout={handleLogout}
        />;
    }

    // Dacă a selectat o bază de date dar nu s-a autentificat, afișează Login
    if (selectedDatabase && !isAuthenticated) {
        return <Login 
            database={selectedDatabase}
            onLogin={handleLogin}
            onBack={goBackToSelection}
        />;
    }

    // Afișează selecția bazelor de date
    return (
        <div className="database-selection-container">
            <div className="database-selection-header">
                <h1>Selectează Baza de Date</h1>
                <p>Alege baza de date pentru gestionarea notificărilor ITP</p>
            </div>

            <div className="databases-grid">
                {databases.map((database) => (
                    <div 
                        key={database.id}
                        className="database-card"
                        onClick={() => handleDatabaseSelect(database)}
                        style={{ borderLeftColor: database.color }}
                        data-requires-server={database.requiresServer}
                    >
                        <div className="database-header">
                            <div 
                                className="database-icon"
                                style={{ backgroundColor: database.color }}
                            >
                                {database.icon}
                            </div>
                            <div className="database-info">
                                <h3>{database.name}</h3>
                                <p>{database.description}</p>
                                <div className="database-type-badge">
                                    <span className="type-label">{database.type}</span>
                                    {!database.requiresServer && (
                                        <span className="offline-badge">Offline Ready</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="database-features">
                            {database.features.map((feature, index) => (
                                <div key={index} className="feature-item">
                                    <span className="feature-dot"></span>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="database-stats">
                            <div className="stat">
                                <FiUsers />
                                <span>{database.users} utilizatori</span>
                            </div>
                            <div className={`database-status ${database.status}`}>
                                <span className="status-dot"></span>
                                {database.status === 'online' ? 'Server necesar' : 'Funcționare locală'}
                            </div>
                        </div>
                        
                        <div className="database-actions">
                            <button className="btn-connect">
                                Conectează-te
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="database-footer">
                <p>💡 Bazele de date offline (SQLite și JSON) nu necesită server MongoDB să fie pornit.</p>
                <p>🔒 Fiecare bază de date are propriul sistem de autentificare și date separate.</p>
            </div>
        </div>
    );
}

export default DatabaseSelection;