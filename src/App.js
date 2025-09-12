import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
// import Login from './components/auth/Login'; // No longer needed
import Dashboard from './components/dashboard/Dashboard';

import './App.css';

const setAuthToken = token => {
    if (token) {
        // Apply authorization token to every request if logged in
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Check for token to keep user logged in
if (localStorage.jwtToken) {
    // Set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwtDecode(token);
    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
        // Logout user
        localStorage.removeItem('jwtToken');
        // Redirect to login
        window.location.href = './login';
    }
}

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/register" element={<Register />} />
                    {/* <Route path="/login" element={<Login />} /> */}
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
