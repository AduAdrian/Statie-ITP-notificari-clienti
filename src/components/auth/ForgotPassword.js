import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiPhone, FiSend } from 'react-icons/fi';
import axios from 'axios';

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: choose method, 2: enter details, 3: enter code, 4: new password
    const [method, setMethod] = useState(''); // 'email' or 'sms'
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleMethodSelect = (selectedMethod) => {
        setMethod(selectedMethod);
        setStep(2);
        setErrors({});
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const payload = method === 'email' 
                ? { email, method: 'email' }
                : { phone, method: 'sms' };

            const response = await axios.post('http://localhost:5000/api/users/forgot-password', payload);
            
            if (response.data.success) {
                setMessage(response.data.message);
                // Pentru email, nu trecem la step 3 (cod), ci afișăm mesajul
                if (method === 'email') {
                    setStep(5); // Step nou pentru mesajul de email trimis
                } else {
                    setStep(3); // Pentru SMS, trecem la introducerea codului
                }
                
                // Debug info pentru dezvoltare
                if (response.data.debug) {
                    console.log('Debug:', response.data.debug);
                }
            }
        } catch (error) {
            setErrors(error.response?.data || { general: 'Eroare la trimiterea codului' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const payload = {
                code,
                method,
                ...(method === 'email' ? { email } : { phone })
            };

            await axios.post('http://localhost:5000/api/users/verify-reset-code', payload);
            setStep(4);
        } catch (error) {
            setErrors(error.response?.data || { code: 'Cod invalid sau expirat' });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setErrors({ confirmPassword: 'Parolele nu se potrivesc' });
            return;
        }

        if (newPassword.length < 6) {
            setErrors({ newPassword: 'Parola trebuie să aibă cel puțin 6 caractere' });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const payload = {
                code,
                newPassword,
                method,
                ...(method === 'email' ? { email } : { phone })
            };

            await axios.post('http://localhost:5000/api/users/reset-password', payload);
            setMessage('Parola a fost resetată cu succes!');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setErrors(error.response?.data || { general: 'Eroare la resetarea parolei' });
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className="auth-form">
            <h3 className="step-title">Alege metoda de resetare</h3>
            <p className="step-subtitle">Cum vrei să primești codul de resetare?</p>
            
            <div className="method-options">
                <button
                    type="button"
                    className="method-btn"
                    onClick={() => handleMethodSelect('email')}
                >
                    <FiMail className="method-icon" />
                    <div>
                        <h4>Email</h4>
                        <p>Trimite codul pe email</p>
                    </div>
                </button>

                <button
                    type="button"
                    className="method-btn"
                    onClick={() => handleMethodSelect('sms')}
                >
                    <FiPhone className="method-icon" />
                    <div>
                        <h4>SMS</h4>
                        <p>Trimite codul pe telefon</p>
                    </div>
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <form onSubmit={handleSendCode} className="auth-form">
            <h3 className="step-title">
                {method === 'email' ? 'Introdu adresa de email' : 'Introdu numărul de telefon'}
            </h3>
            <p className="step-subtitle">
                {method === 'email' 
                    ? 'Vom trimite un cod de resetare pe acest email'
                    : 'Vom trimite un cod de resetare prin SMS'
                }
            </p>

            <div className="form-group">
                <div className="input-wrapper">
                    {method === 'email' ? <FiMail className="input-icon" /> : <FiPhone className="input-icon" />}
                    <input
                        type={method === 'email' ? 'email' : 'tel'}
                        value={method === 'email' ? email : phone}
                        onChange={(e) => method === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
                        placeholder={method === 'email' ? 'Adresa de email' : 'Număr de telefon'}
                        className="form-input"
                        required
                    />
                </div>
                {errors[method] && <span className="error-text">{errors[method]}</span>}
                {errors.general && <span className="error-text">{errors.general}</span>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
                <FiSend className="btn-icon" />
                {loading ? 'Se trimite...' : 'Trimite codul'}
            </button>

            <button type="button" className="btn-back-step" onClick={() => setStep(1)}>
                Înapoi la opțiuni
            </button>
        </form>
    );

    const renderStep3 = () => (
        <form onSubmit={handleVerifyCode} className="auth-form">
            <h3 className="step-title">Introdu codul primit</h3>
            <p className="step-subtitle">
                {message || `Codul a fost trimis ${method === 'email' ? 'pe email' : 'prin SMS'}`}
            </p>

            <div className="form-group">
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Codul de 6 cifre"
                        className="form-input code-input"
                        maxLength="6"
                        required
                    />
                </div>
                {errors.code && <span className="error-text">{errors.code}</span>}
                {errors.general && <span className="error-text">{errors.general}</span>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Se verifică...' : 'Verifică codul'}
            </button>

            <button type="button" className="btn-back-step" onClick={() => setStep(2)}>
                Trimite din nou codul
            </button>
        </form>
    );

    const renderStep4 = () => (
        <form onSubmit={handleResetPassword} className="auth-form">
            <h3 className="step-title">Setează parola nouă</h3>
            <p className="step-subtitle">Introdu noua ta parolă</p>

            <div className="form-group">
                <div className="input-wrapper">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Parola nouă"
                        className="form-input"
                        required
                    />
                </div>
                {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
                <div className="input-wrapper">
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmă parola"
                        className="form-input"
                        required
                    />
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            {errors.general && <span className="error-text">{errors.general}</span>}
            {message && <div className="success-message">{message}</div>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Se resetează...' : 'Resetează parola'}
            </button>
        </form>
    );

    const renderStep5 = () => (
        <div className="form-section">
            <div className="success-icon">
                ✉️
            </div>
            <h3>Email trimis cu succes!</h3>
            <p className="success-message">{message}</p>
            
            <div className="info-box">
                <p>📧 <strong>Verifică inbox-ul și folder-ul spam</strong> pentru email-ul cu link-ul de resetare.</p>
                <p>🔒 Link-ul este valabil <strong>1 oră</strong>.</p>
                <p>🖱️ Apasă pe link pentru a fi redirecționat către pagina de resetare.</p>
            </div>

            <div className="form-actions">
                <Link to="/" className="back-to-login">
                    <FiArrowLeft size={16} />
                    Înapoi la login
                </Link>
            </div>
        </div>
    );

    return (
        <div className="auth-container">
            <div className="auth-card forgot-password-card">
                <div className="auth-header">
                    <Link to="/" className="back-btn">
                        <FiArrowLeft size={20} />
                        <span>Înapoi</span>
                    </Link>
                    <h2 className="auth-title">Am uitat parola</h2>
                    <div className="progress-bar">
                        <div className="progress-steps">
                            {[1, 2, 3, 4].map((stepNum) => (
                                <div 
                                    key={stepNum}
                                    className={`progress-step ${step >= stepNum ? 'active' : ''}`}
                                >
                                    {stepNum}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
            </div>
        </div>
    );
}

export default ForgotPassword;
