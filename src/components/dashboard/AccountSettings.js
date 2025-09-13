import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiBriefcase, FiPhone, FiMail, FiCreditCard, FiSave, FiArrowLeft, FiCheck, FiStar } from 'react-icons/fi';
import axios from 'axios';
import currentConfig from '../../config/config';
import useAuthRedirect from '../../hooks/useAuthRedirect';

function AccountSettings() {
    const user = useAuthRedirect(); // Use the hook for authentication
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        phone: '',
        email: '',
        subscription: 'Standard'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const subscriptionPlans = [
        {
            id: 'Standard',
            name: 'Standard',
            price: 'Gratuit',
            features: [
                'Până la 100 notificări/lună',
                'Export Excel de bază',
                'Suport email'
            ],
            color: '#6c757d',
            icon: FiUser
        },
        {
            id: 'Premium',
            name: 'Premium',
            price: '49 RON/lună',
            features: [
                'Până la 1000 notificări/lună',
                'Export Excel avansat',
                'SMS notifications',
                'Suport prioritar',
                'Backup automat'
            ],
            color: '#007bff',
            icon: FiStar,
            popular: true
        },
        {
            id: 'Premium+',
            name: 'Premium+',
            price: '99 RON/lună',
            features: [
                'Notificări nelimitate',
                'API access',
                'Multiple databases',
                'White-label solution',
                'Suport telefonic 24/7',
                'Custom integrations'
            ],
            color: '#28a745',
            icon: FiCreditCard
        }
    ];

    useEffect(() => {
        // User authentication is handled by useAuthRedirect hook
        if (user) {
            fetchUserData(user.id);
        }
    }, [user]);

    const fetchUserData = async (userId) => {
        try {
            const response = await axios.get(`${currentConfig.API_BASE_URL}/users/profile/${userId}`);
            const userData = response.data;
            
            setFormData({
                name: userData.name || '',
                companyName: userData.companyName || '',
                phone: userData.phone || '',
                email: userData.email || '',
                subscription: userData.subscription || 'Standard'
            });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Eroare la încărcarea datelor';
            console.error('Fetch user data error:', errorMsg, error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubscriptionChange = (planId) => {
        setFormData(prev => ({
            ...prev,
            subscription: planId
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setMessage('');

        try {
            await axios.put(`${currentConfig.API_BASE_URL}/users/profile/${user.id}`, formData);
            setMessage('Setările au fost salvate cu succes!');
        } catch (error) {
            const errorData = error.response?.data || { general: 'Eroare de rețea' };
            setErrors(errorData);
            console.error('Save settings error:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderSubscriptionPlan = (plan) => (
        <div 
            key={plan.id}
            className={`subscription-plan ${formData.subscription === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
            onClick={() => handleSubscriptionChange(plan.id)}
        >
            {plan.popular && <div className="popular-badge">Cel mai popular</div>}
            
            <div className="plan-header">
                <plan.icon className="plan-icon" style={{ color: plan.color }} />
                <div>
                    <h4 className="plan-name">{plan.name}</h4>
                    <p className="plan-price">{plan.price}</p>
                </div>
                {formData.subscription === plan.id && (
                    <FiCheck className="selected-icon" />
                )}
            </div>

            <ul className="plan-features">
                {plan.features.map((feature, index) => (
                    <li key={index}>
                        <FiCheck className="feature-icon" />
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );

    if (!user) {
        return <div className="loading">Se încarcă...</div>;
    }

    return (
        <div className="settings-container">
            <div className="settings-header">
                <button onClick={() => navigate('/dashboard')} className="back-btn">
                    <FiArrowLeft size={20} />
                    <span>Înapoi la Dashboard</span>
                </button>
                <h1 className="settings-title">Setări Cont</h1>
                <p className="settings-subtitle">Gestionează informațiile contului și abonamentul</p>
            </div>

            <form onSubmit={handleSubmit} className="settings-form">
                {/* Informații de bază */}
                <div className="settings-section">
                    <h3 className="section-title">Informații de bază</h3>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Nume cont</label>
                            <div className="input-wrapper">
                                <FiUser className="input-icon" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Numele tău complet"
                                    required
                                />
                            </div>
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="companyName">Nume firmă</label>
                            <div className="input-wrapper">
                                                            <FiBriefcase className="field-icon" />
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Numele companiei (opțional)"
                                />
                            </div>
                            {errors.companyName && <span className="error-text">{errors.companyName}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="phone">Număr de telefon</label>
                            <div className="input-wrapper">
                                <FiPhone className="input-icon" />
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="+40 xxx xxx xxx"
                                />
                            </div>
                            {errors.phone && <span className="error-text">{errors.phone}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="email@exemplu.com"
                                    required
                                />
                            </div>
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                    </div>
                </div>

                {/* Abonament */}
                <div className="settings-section">
                    <h3 className="section-title">Planuri de abonament</h3>
                    <p className="section-subtitle">Alege planul care se potrivește nevoilor tale</p>
                    
                    <div className="subscription-plans">
                        {subscriptionPlans.map(plan => renderSubscriptionPlan(plan))}
                    </div>
                </div>

                {/* Mesaje */}
                {message && <div className="success-message">{message}</div>}
                {errors.general && <span className="error-text">{errors.general}</span>}

                {/* Butoane */}
                <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={loading}>
                        <FiSave className="btn-icon" />
                        {loading ? 'Se salvează...' : 'Salvează modificările'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AccountSettings;
