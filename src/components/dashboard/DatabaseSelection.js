import React, { useState } from 'react';
import { FiDatabase, FiUsers, FiServer, FiLock } from 'react-icons/fi';
import Login from '../auth/Login';
import Dashboard from './Dashboard';

function DatabaseSelection() {
    const [selectedDatabase, setSelectedDatabase] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Lista bazelor de date disponibile
    const databases = [
        {
            id: 'statie_itp_main',
            name: 'Stația ITP Principală',
            description: 'Baza de date principală pentru notificări ITP',
            icon: <FiDatabase />,
            color: '#007bff',
            users: 145
        },
        {
            id: 'statie_itp_secondary',
            name: 'Stația ITP Secundară', 
            description: 'Baza de date secundară pentru backup și teste',
            icon: <FiServer />,
            color: '#28a745',
            users: 78
        },
        {
            id: 'statie_itp_archive',
            name: 'Arhiva ITP',
            description: 'Arhiva cu înregistrările istorice',
            icon: <FiLock />,
            color: '#6c757d',
            users: 23
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
                            </div>
                        </div>
                        
                        <div className="database-stats">
                            <div className="stat">
                                <FiUsers />
                                <span>{database.users} utilizatori</span>
                            </div>
                            <div className="database-status online">
                                <span className="status-dot"></span>
                                Online
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
                <p>💡 Fiecare bază de date are propriul sistem de autentificare și date separate.</p>
            </div>
        </div>
    );
}

export default DatabaseSelection;