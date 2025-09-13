import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FiArrowLeft, FiMail, FiLock } from 'react-icons/fi';
import currentConfig from '../../config/config';
import setAuthToken from '../../utils/auth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    const onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password
        };
        
        axios
            .post(`${currentConfig.API_BASE_URL}/users/login`, userData)
            .then(res => {
                // Save to localStorage
                const { token } = res.data;
                localStorage.setItem('jwtToken', token);

                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Set token to Auth header
                setAuthToken(token);
                // Decode token to get user data
                const decoded = jwtDecode(token);
                console.log(decoded);
                navigate('/dashboard');
            })
            .catch(err => {
                const errorData = err.response?.data || { general: 'Eroare de rețea' };
                setErrors(errorData);
                console.error('Login error:', err);
            });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/landing" className="back-btn">
                        <FiArrowLeft size={20} />
                        <span>Back</span>
                    </Link>
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">
                        Sign in to access your database workspace
                    </p>
                </div>

                <form onSubmit={onSubmit} className="auth-form">
                    <div className="form-group">
                        <div className="input-wrapper">
                            <FiMail className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="form-input"
                                required
                            />
                        </div>
                        {(errors.email || errors.emailnotfound) && (
                            <span className="error-text">
                                {errors.email || errors.emailnotfound}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <FiLock className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="form-input"
                                required
                            />
                        </div>
                        {(errors.password || errors.passwordincorrect) && (
                            <span className="error-text">
                                {errors.password || errors.passwordincorrect}
                            </span>
                        )}
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="forgot-password-link">
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Sign In to Dashboard
                    </button>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register" className="auth-link">Create Account</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
