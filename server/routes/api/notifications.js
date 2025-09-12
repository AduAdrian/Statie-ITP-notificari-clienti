const express = require('express');
const router = express.Router();
const passport = require('passport');

// Notification Model
const Notification = require('../../models/Notification');

// @route   GET api/notifications
// @desc    Get all notifications
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Notification.find()
        .sort({ date: -1 })
        .then(notifications => res.json(notifications));
});

// @route   POST api/notifications
// @desc    Add a new notification
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const newNotification = new Notification({
        plateNumber: req.body.plateNumber,
        phoneNumber: req.body.phoneNumber,
        validity: req.body.validity,
        expirationDate: req.body.expirationDate
    });

    newNotification.save().then(notification => res.json(notification));
});

module.exports = router;
