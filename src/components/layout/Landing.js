import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import currentConfig from '../../config/config';
import setAuthToken from '../../utils/auth';

import { FiMail, FiLock } from 'react-icons/fi';

function Landing() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // On component mount, check if user is already logged in
    useEffect(() => {
        if (localStorage.jwtToken) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password
        };
        axios
            .post(`${currentConfig.API_BASE_URL}/users/login`, userData)
            .then(res => {
                const { token } = res.data;
                localStorage.setItem('jwtToken', token);
                setAuthToken(token);
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
                <h1>Miseda Inspect SRL</h1>
                <p>Autentificare în panoul de control</p>
                <form noValidate onSubmit={onSubmit}>
                    <div className="input-group">
                        <FiMail className="icon" />
                        <input
                            placeholder="Email"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            error={errors.email}
                            id="email"
                            type="email"
                            className="form-control"
                        />
                         {(errors.email || errors.emailnotfound) && (
                            <span className="error-text">
                                {errors.email || errors.emailnotfound}
                            </span>
                        )}
                    </div>
                    <div className="input-group">
                        <FiLock className="icon" />
                        <input
                            placeholder="Parolă"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            error={errors.password}
                            id="password"
                            type="password"
                            className="form-control"
                        />
                        {(errors.password || errors.passwordincorrect) && (
                            <span className="error-text">
                                {errors.password || errors.passwordincorrect}
                            </span>
                        )}
                    </div>
                    <div style={{ marginTop: '2rem' }}>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Landing;
