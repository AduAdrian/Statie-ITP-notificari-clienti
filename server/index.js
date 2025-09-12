const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

const users = require('./routes/api/users');
const notifications = require('./routes/api/notifications');
const { checkExpirations } = require('./services/notificationScheduler');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// DB Config
const db = "mongodb://localhost/notificari"; // Replace with your MongoDB connection string

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected...');
        // Start the scheduler after successful DB connection
        checkExpirations();
    })
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Routes
app.use('/api/users', users);
app.use('/api/notifications', notifications);

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
