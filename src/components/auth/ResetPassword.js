import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff, FiLock, FiCheck, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validări frontend
        if (newPassword !== confirmPassword) {
            setError('Parolele nu se potrivesc');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Parola trebuie să aibă cel puțin 6 caractere');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/users/reset-password', {
                token,
                newPassword,
                method: 'email'
            });

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (err) {
            setError(
                err.response?.data?.error || 
                'A apărut o eroare. Token-ul poate fi invalid sau expirat.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <div className="flex justify-center">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <FiAlertCircle className="text-red-600 text-2xl" />
                                </div>
                            </div>
                            <h2 className="mt-4 text-2xl font-bold text-gray-900">
                                Link invalid
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Link-ul de resetare este invalid sau lipsește.
                            </p>
                            
                            <div className="mt-6">
                                <Link
                                    to="/forgot-password"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Solicită un link nou
                                </Link>
                            </div>
                            
                            <div className="mt-4">
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-500 text-sm"
                                >
                                    <FiArrowLeft />
                                    Înapoi la login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <div className="flex justify-center">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <FiCheck className="text-green-600 text-2xl" />
                                </div>
                            </div>
                            <h2 className="mt-4 text-2xl font-bold text-gray-900">
                                Parola a fost resetată!
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Parola ta a fost schimbată cu succes. Vei fi redirecționat către pagina de login.
                            </p>
                            
                            <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-800">
                                    ✅ Acum te poți loga cu noua parolă.
                                </p>
                            </div>

                            <div className="mt-6">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Mergi la login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center">
                        <div className="flex justify-center">
                            <div className="bg-indigo-100 p-3 rounded-full">
                                <FiLock className="text-indigo-600 text-2xl" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Resetează parola
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Introdu noua parolă pentru contul tău
                        </p>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <FiAlertCircle className="text-red-500 flex-shrink-0" />
                            <span className="text-sm text-red-700">{error}</span>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {/* Parolă nouă */}
                        <div>
                            <label htmlFor="newPassword" className="sr-only">
                                Parolă nouă
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FiLock className="text-gray-400" />
                                </div>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full pl-10 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Parolă nouă (min. 6 caractere)"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <FiEye className="text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirmă parola */}
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">
                                Confirmă parola
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FiLock className="text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full pl-10 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirmă parola nouă"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <FiEye className="text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Indicatori putere parolă */}
                        {newPassword && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <div className={`w-2 h-2 rounded-full ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <span className={newPassword.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                                        Cel puțin 6 caractere
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className={`w-2 h-2 rounded-full ${newPassword === confirmPassword && confirmPassword ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <span className={newPassword === confirmPassword && confirmPassword ? 'text-green-600' : 'text-gray-500'}>
                                        Parolele se potrivesc
                                    </span>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all ${
                                    loading
                                        ? 'bg-indigo-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Se resetează...
                                    </div>
                                ) : (
                                    '🔒 Resetează parola'
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-500 text-sm"
                            >
                                <FiArrowLeft />
                                Înapoi la login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
