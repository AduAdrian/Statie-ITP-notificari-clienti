import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Landing() {
    const [email, setEmail] = useState('aduadu321@gmail.com');
    const [password, setPassword] = useState('Miseda!');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // On component mount, check if user is already logged in
    useEffect(() => {
        if (localStorage.jwtToken) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const setAuthToken = token => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password
        };
        axios
            .post('http://localhost:5000/api/users/login', userData)
            .then(res => {
                const { token } = res.data;
                localStorage.setItem('jwtToken', token);
                setAuthToken(token);
                const decoded = jwtDecode(token);
                console.log(decoded);
                navigate('/dashboard');
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    setErrors(err.response.data);
                }
            });
    };

    return (
        <div style={{ height: '75vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="container">
            <div className="row">
                <div className="col s12 center-align">
                    <h2>
                        <b>Miseda Inspect SRL</b>
                    </h2>
                </div>
            </div>
            <div className="row">
                <div className="col s12 m6 offset-m3 center-align">
                    <form noValidate onSubmit={onSubmit}>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                error={errors.email}
                                id="email"
                                type="email"
                                className="center-align"
                            />
                            <label htmlFor="email">Email</label>
                            <span className="red-text">
                                {errors.email}
                                {errors.emailnotfound}
                            </span>
                        </div>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                error={errors.password}
                                id="password"
                                type="password"
                                className="center-align"
                            />
                            <label htmlFor="password">Password</label>
                            <span className="red-text">
                                {errors.password}
                                {errors.passwordincorrect}
                            </span>
                        </div>
                        <div className="col s12" style={{ paddingLeft: '11.250px', marginTop: '1rem' }}>
                            <button
                                style={{
                                    width: '150px',
                                    borderRadius: '3px',
                                    letterSpacing: '1.5px',
                                }}
                                type="submit"
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                            >
                                Log In
                            </button>
                        </div>
                    </form>
                    <div className="col s12" style={{marginTop: '2rem'}}>
                         <p className="grey-text text-darken-1">
                            Nu aveți cont? <Link to="/register">Creați cont de administrator</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;
