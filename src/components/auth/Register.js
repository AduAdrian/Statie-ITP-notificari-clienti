import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const onSubmit = e => {
        e.preventDefault();
        if (password !== password2) {
            setErrors({ password2: "Passwords must match" });
            return;
        }
        const newUser = {
            name: name,
            email: email,
            password: password
        };
        axios
            .post('http://localhost:5000/api/users/register', newUser)
            .then(res => navigate('/login')) // re-direct to login on successful register
            .catch(err =>
                setErrors(err.response.data)
            );
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col s8 offset-s2">
                    <Link to="/" className="btn-flat waves-effect">
                        <i className="material-icons left">keyboard_backspace</i> Back to
                        home
                    </Link>
                    <div className="col s12" style={{ paddingLeft: '11.250px' }}>
                        <h4>
                            <b>Register</b> below
                        </h4>
                        <p className="grey-text text-darken-1">
                            Already have an account? <Link to="/login">Log in</Link>
                        </p>
                    </div>
                    <form noValidate onSubmit={onSubmit}>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setName(e.target.value)}
                                value={name}
                                error={errors.name}
                                id="name"
                                type="text"
                            />
                            <label htmlFor="name">Name</label>
                            <span className="red-text">{errors.name}</span>
                        </div>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                error={errors.email}
                                id="email"
                                type="email"
                            />
                            <label htmlFor="email">Email</label>
                            <span className="red-text">{errors.email}</span>
                        </div>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                error={errors.password}
                                id="password"
                                type="password"
                            />
                            <label htmlFor="password">Password</label>
                            <span className="red-text">{errors.password}</span>
                        </div>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setPassword2(e.target.value)}
                                value={password2}
                                error={errors.password2}
                                id="password2"
                                type="password"
                            />
                            <label htmlFor="password2">Confirm Password</label>
                            <span className="red-text">{errors.password2}</span>
                        </div>
                        <div className="col s12" style={{ paddingLeft: '11.250px' }}>
                            <button
                                style={{
                                    width: '150px',
                                    borderRadius: '3px',
                                    letterSpacing: '1.5px',
                                    marginTop: '1rem'
                                }}
                                type="submit"
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
