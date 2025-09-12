import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiDatabase, FiPhone, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [databaseName, setDatabaseName] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const onSubmit = e => {
        e.preventDefault();
        if (password !== password2) {
            setErrors({ password2: "Passwords must match" });
            return;
        }
        if (!databaseName.trim()) {
            setErrors({ databaseName: "Database name is required" });
            return;
        }
        const newUser = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            databaseName: databaseName.trim()
        };
        axios
            .post('http://localhost:5000/api/users/register', newUser)
            .then(res => navigate('/login')) // re-direct to login on successful register
            .catch(err =>
                setErrors(err.response.data)
            );
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="back-btn">
                        <FiArrowLeft size={20} />
                        <span>Back</span>
                    </Link>
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">
                        Setup your personal database workspace
                    </p>
                </div>

                <form onSubmit={onSubmit} className="auth-form">
                    <div className="form-group">
                        <div className="input-wrapper">
                            <FiUser className="input-icon" />
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                className="form-input"
                                required
                            />
                        </div>
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

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
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <FiPhone className="input-icon" />
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Phone Number (optional)"
                                className="form-input"
                            />
                        </div>
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                        <div className="help-text">
                            <small>Pentru recuperarea parolei prin SMS</small>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <FiDatabase className="input-icon" />
                            <input
                                type="text"
                                id="databaseName"
                                value={databaseName}
                                onChange={(e) => setDatabaseName(e.target.value)}
                                placeholder="Database Name (e.g., MyCompany_DB)"
                                className="form-input"
                                required
                            />
                        </div>
                        {errors.databaseName && <span className="error-text">{errors.databaseName}</span>}
                        <div className="help-text">
                            <small>This will be your private database workspace name</small>
                        </div>
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
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <FiLock className="input-icon" />
                            <input
                                type="password"
                                id="password2"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                placeholder="Confirm Password"
                                className="form-input"
                                required
                            />
                        </div>
                        {errors.password2 && <span className="error-text">{errors.password2}</span>}
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Create Account & Database
                    </button>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
