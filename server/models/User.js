const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: false
    },
    companyName: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    databaseName: {
        type: String,
        required: true
    },
    subscription: {
        type: String,
        enum: ['Standard', 'Premium', 'Premium+'],
        default: 'Standard'
    },
    resetCode: {
        type: String,
        required: false
    },
    resetCodeExpires: {
        type: Date,
        required: false
    },
    resetToken: {
        type: String,
        required: false
    },
    resetTokenExpires: {
        type: Date,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('users', UserSchema);
