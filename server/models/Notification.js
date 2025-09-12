const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const NotificationSchema = new Schema({
    plateNumber: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    validity: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: 'În așteptare'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Notification = mongoose.model('notification', NotificationSchema);
