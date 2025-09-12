// Configurație API pentru diferite medii
const config = {
    development: {
        API_BASE_URL: 'http://localhost:5000/api',
        APP_URL: 'http://localhost:3000'
    },
    production: {
        API_BASE_URL: 'https://misedainspectsrl.ro/api',
        APP_URL: 'https://misedainspectsrl.ro'
    }
};

const currentEnv = process.env.NODE_ENV || 'development';
const currentConfig = config[currentEnv];

export default currentConfig;
