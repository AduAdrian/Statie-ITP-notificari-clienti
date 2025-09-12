// Configurație API pentru diferite medii
const config = {
    development: {
        API_BASE_URL: 'http://localhost:5000/api',
        APP_URL: 'http://localhost:3000',
        // Configurații database pentru diferite locații
        databases: {
            'statie_itp_main': {
                type: 'mongodb',
                endpoint: '/api/mongodb'
            },
            'statie_itp_secondary': {
                type: 'sqlite',
                endpoint: '/api/sqlite'
            },
            'statie_itp_archive': {
                type: 'json',
                endpoint: '/api/json'
            }
        }
    },
    production: {
        API_BASE_URL: 'https://misedainspectsrl.ro/api',
        APP_URL: 'https://misedainspectsrl.ro',
        // Configurații database pentru diferite locații în producție
        databases: {
            'statie_itp_main': {
                type: 'mongodb',
                endpoint: '/api/mongodb'
            },
            'statie_itp_secondary': {
                type: 'sqlite',
                endpoint: '/api/sqlite'
            },
            'statie_itp_archive': {
                type: 'json',
                endpoint: '/api/json'
            }
        }
    }
};

const currentEnv = process.env.NODE_ENV || 'development';
const currentConfig = config[currentEnv];

// Helper function pentru obținerea configurației database
export const getDatabaseConfig = (databaseId) => {
    return currentConfig.databases[databaseId] || null;
};

// Helper function pentru construirea URL-ului API bazat pe tipul database
export const buildApiUrl = (databaseId, endpoint = '') => {
    const dbConfig = getDatabaseConfig(databaseId);
    if (!dbConfig) return `${currentConfig.API_BASE_URL}${endpoint}`;
    
    return `${currentConfig.API_BASE_URL}${dbConfig.endpoint}${endpoint}`;
};

export default currentConfig;
