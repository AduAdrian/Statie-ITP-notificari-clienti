import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import setAuthToken from '../utils/auth';

/**
 * Custom hook for handling authentication redirects
 * Validates JWT tokens and redirects unauthenticated users
 * @returns {Object} decoded user data if valid, null otherwise
 */
const useAuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        
        if (!token) {
            navigate('/');
            return;
        }

        try {
            // Decode token and validate
            const decoded = jwtDecode(token);
            
            // Check for expired token
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                // Token expired - logout user
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('rememberedEmail');
                setAuthToken(null);
                navigate('/');
                return;
            }

            // Token is valid - ensure auth header is set
            setAuthToken(token);
            return decoded;
            
        } catch (error) {
            console.error('Token invalid:', error);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('rememberedEmail');
            setAuthToken(null);
            navigate('/');
            return;
        }
    }, [navigate]);

    // Return decoded user data for components to use
    const token = localStorage.getItem('jwtToken');
    if (token) {
        try {
            return jwtDecode(token);
        } catch (error) {
            return null;
        }
    }
    return null;
};

export default useAuthRedirect;