import axios from 'axios';
import currentConfig from '../config/config';

/**
 * Sets or clears the Authorization header for axios requests
 * @param {string} token - JWT token to set, or null/undefined to clear
 */
const setAuthToken = (token) => {
    if (token) {
        // Apply authorization token to every request if logged in
        axios.defaults.headers.common['Authorization'] = token;
        // Set the base URL for all requests
        axios.defaults.baseURL = currentConfig.API_BASE_URL;
    } else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
        // Optionally clear base URL
        delete axios.defaults.baseURL;
    }
};

export default setAuthToken;