const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/registration', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// User model
const User = mongoose.model('User', {
    username: String,
    email: String,
    password: String
});

// Register route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Simple error detection
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    // Save user to MongoDB
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.json({ message: 'Registration successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
