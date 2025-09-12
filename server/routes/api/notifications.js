const express = require('express');
const router = express.Router();
const passport = require('passport');

// Notification Model
const Notification = require('../../models/Notification');

// @route   GET api/notifications
// @desc    Get all notifications
// @access  Public (for simplicity during development)
router.get('/', (req, res) => {
    Notification.find()
        .sort({ date: -1 })
        .then(notifications => res.json(notifications))
        .catch(err => res.status(400).json({ error: 'Eroare la încărcarea notificărilor' }));
});

// @route   POST api/notifications
// @desc    Add a new notification
// @access  Public (for development)
router.post('/', (req, res) => {
    const newNotification = new Notification({
        plateNumber: req.body.plateNumber,
        phoneNumber: req.body.phoneNumber,
        validity: req.body.validity,
        expirationDate: req.body.expirationDate,
        status: req.body.status || 'În așteptare'
    });

    newNotification.save()
        .then(notification => res.json(notification))
        .catch(err => res.status(400).json({ error: 'Eroare la salvarea notificării' }));
});

// @route   PUT api/notifications/:id
// @desc    Update a notification
// @access  Public (for development)
router.put('/:id', (req, res) => {
    Notification.findByIdAndUpdate(
        req.params.id,
        {
            plateNumber: req.body.plateNumber,
            phoneNumber: req.body.phoneNumber,
            validity: req.body.validity,
            expirationDate: req.body.expirationDate,
            status: req.body.status || 'În așteptare'
        },
        { new: true }
    )
    .then(notification => {
        if (!notification) {
            return res.status(404).json({ error: 'Notificarea nu a fost găsită' });
        }
        res.json(notification);
    })
    .catch(err => res.status(400).json({ error: 'Eroare la actualizarea notificării' }));
});

// @route   DELETE api/notifications/:id
// @desc    Delete a notification
// @access  Public (for development)
router.delete('/:id', (req, res) => {
    Notification.findByIdAndDelete(req.params.id)
        .then(notification => {
            if (!notification) {
                return res.status(404).json({ error: 'Notificarea nu a fost găsită' });
            }
            res.json({ success: true, message: 'Notificare ștearsă cu succes' });
        })
        .catch(err => res.status(400).json({ error: 'Eroare la ștergerea notificării' }));
});

module.exports = router;
