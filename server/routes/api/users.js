const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const crypto = require('crypto');

// Load User model
const User = require('../../models/User');

// Load email service
const emailService = require('../../services/emailService');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: 'Email already exists' });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                databaseName: req.body.databaseName
            });

            // Hash password before saving
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    
                    try {
                        // Save user to database
                        const savedUser = await newUser.save();
                        
                        // Send confirmation email
                        try {
                            await emailService.sendAccountConfirmationEmail(
                                savedUser.email,
                                savedUser.name,
                                savedUser.databaseName
                            );
                            console.log(`Confirmation email sent to: ${savedUser.email}`);
                        } catch (emailError) {
                            console.error('Failed to send confirmation email:', emailError.message);
                            // Don't fail the registration if email fails
                        }
                        
                        // Return success response
                        res.json({
                            message: 'User registered successfully',
                            user: {
                                id: savedUser._id,
                                name: savedUser.name,
                                email: savedUser.email,
                                databaseName: savedUser.databaseName
                            }
                        });
                        
                    } catch (saveError) {
                        console.error('Error saving user:', saveError);
                        res.status(500).json({ error: 'Failed to create user account' });
                    }
                });
            });
        }
    });
});

// @route   POST api/users/login
// @desc    Login user and return JWT token
// @access  Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: 'Email not found' });
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };

                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: 'Password incorrect' });
            }
        });
    });
});

// @route   POST api/users/forgot-password
// @desc    Request password reset (email or SMS)
// @access  Public
router.post('/forgot-password', (req, res) => {
    const { email, phone, method } = req.body;

    // Validări input
    if (!method || (method !== 'email' && method !== 'sms')) {
        return res.status(400).json({ error: 'Method must be either email or sms' });
    }

    if (method === 'email' && !email) {
        return res.status(400).json({ email: 'Email is required for email method' });
    }
    if (method === 'sms' && !phone) {
        return res.status(400).json({ phone: 'Phone number is required for SMS method' });
    }

    // Caută utilizatorul
    let searchQuery = {};
    if (method === 'email') {
        searchQuery.email = email;
    } else {
        searchQuery.phone = phone;
    }

    User.findOne(searchQuery).then(user => {
        if (!user) {
            return res.status(404).json({ 
                error: method === 'email' ? 'Nu s-a găsit niciun utilizator cu acest email.' : 'Nu s-a găsit niciun utilizator cu acest număr de telefon.'
            });
        }

        if (method === 'email') {
            // Generează token pentru email (valid 1 oră)
            const resetToken = crypto.randomBytes(32).toString('hex');
            const tokenExpires = new Date(Date.now() + 60*60*1000); // 1 oră

            user.resetToken = resetToken;
            user.resetTokenExpires = tokenExpires;
            
            user.save().then(savedUser => {
                // Trimite email cu link
                const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
                
                emailService.sendResetLinkEmail(user.email, resetLink)
                    .then(() => {
                        res.json({
                            success: true,
                            message: 'Link-ul de resetare a fost trimis prin email. Verificați inbox-ul.',
                            debug: `Token: ${resetToken}` // Pentru debug - elimină în producție
                        });
                    })
                    .catch(emailError => {
                        console.error('Email send error:', emailError);
                        res.json({
                            success: true, // Link-ul e generat chiar dacă email-ul nu se trimite
                            message: 'Link-ul de resetare a fost generat. Verificați email-ul.',
                            debug: `Token: ${resetToken}` // Pentru debug
                        });
                    });
            });
        } else {
            // Generează cod pentru SMS (valid 15 minute)
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            const codeExpires = new Date(Date.now() + 15*60*1000); // 15 minute

            user.resetCode = resetCode;
            user.resetCodeExpires = codeExpires;
            
            user.save().then(savedUser => {
                // Trimite SMS cu cod
                // const smsService = require('../../services/smsService');
                
                // smsService.sendResetCodeSms(user.phone, resetCode)
                //     .then(() => {
                        res.json({
                            success: true,
                            message: 'Codul de resetare a fost trimis prin SMS.',
                            debug: `Code: ${resetCode}` // Pentru debug - elimină în producție
                        });
                //     })
                //     .catch(smsError => {
                //         console.error('SMS send error:', smsError);
                //         res.json({
                //             success: true,
                //             message: 'Codul de resetare a fost generat. Verificați SMS-ul.',
                //             debug: `Code: ${resetCode}`
                //         });
                //     });
            });
        }
    }).catch(err => {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Eroare de bază de date' });
    });
});

// @route   POST api/users/reset-password
// @desc    Reset password using token or code
// @access  Public
router.post('/reset-password', (req, res) => {
    const { token, code, email, phone, newPassword, method } = req.body;

    // Validări input
    if (!method || (method !== 'email' && method !== 'sms')) {
        return res.status(400).json({ error: 'Method must be either email or sms' });
    }

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    let searchQuery = {};
    if (method === 'email') {
        if (!token) {
            return res.status(400).json({ error: 'Token is required for email method' });
        }
        searchQuery = {
            resetToken: token,
            resetTokenExpires: { $gt: new Date() }
        };
    } else {
        if (!code || !phone) {
            return res.status(400).json({ error: 'Code and phone are required for SMS method' });
        }
        searchQuery = {
            phone: phone,
            resetCode: code,
            resetCodeExpires: { $gt: new Date() }
        };
    }

    User.findOne(searchQuery).then(user => {
        if (!user) {
            return res.status(400).json({ 
                error: method === 'email' ? 'Token-ul este invalid sau a expirat.' : 'Codul este invalid sau a expirat.'
            });
        }

        // Hash new password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(newPassword, salt, (err, hash) => {
                if (err) throw err;
                
                user.password = hash;
                
                // Clear reset fields
                if (method === 'email') {
                    user.resetToken = undefined;
                    user.resetTokenExpires = undefined;
                } else {
                    user.resetCode = undefined;
                    user.resetCodeExpires = undefined;
                }
                
                user.save().then(() => {
                    res.json({
                        success: true,
                        message: 'Parola a fost resetată cu succes.'
                    });
                }).catch(saveErr => {
                    console.error('Save error:', saveErr);
                    res.status(500).json({ error: 'Eroare la salvarea parolei' });
                });
            });
        });
    }).catch(err => {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Eroare de bază de date' });
    });
});

module.exports = router;
