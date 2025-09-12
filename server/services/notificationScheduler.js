const cron = require('node-cron');
const Notification = require('../models/Notification');
const { sendSms } = require('./smsService');

const checkExpirations = () => {
    // Schedule a task to run every 30 minutes between 8 AM and 8 PM.
    cron.schedule('*/30 8-20 * * *', async () => {
        console.log('Running scheduled check for expiring notifications...');

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        sevenDaysFromNow.setHours(23, 59, 59, 999); // End of the 7th day

        try {
            const expiringNotifications = await Notification.find({
                expirationDate: {
                    $gte: today, // Expiration is from today
                    $lte: sevenDaysFromNow // up to 7 days from now
                },
                status: { $ne: 'SMS Expediat' } // And SMS has not been sent
            });

            if (expiringNotifications.length > 0) {
                console.log(`Found ${expiringNotifications.length} pending notifications within the 7-day window.`);
                for (const notification of expiringNotifications) {
                    try {
                        await sendSms(notification.phoneNumber, notification.plateNumber);
                        // If SMS is sent successfully, update the status
                        notification.status = 'SMS Expediat';
                        await notification.save();
                        console.log(`SMS sent and status updated for ${notification.plateNumber}`);
                    } catch (smsError) {
                        console.error(`Failed to send SMS for ${notification.plateNumber}:`, smsError);
                        // Optionally, set a different status for failed attempts
                        // notification.status = 'Eroare SMS';
                        // await notification.save();
                    }
                }
            } else {
                console.log('No pending notifications to send in the 7-day window.');
            }
        } catch (error) {
            console.error('Error checking for expiring notifications:', error);
        }
    });
};

module.exports = { checkExpirations };
