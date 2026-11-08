
const express = require('express');

const app = express();

// Route 1: Home
app.get('/', (req, res) => {
    res.send('Welcome to my Express Server!');
});

// Route 2: About
app.get('/about', (req, res) => {
    res.json({
        name: 'Nandishwar Reddy',
        section: 'AIML 2B'
    });
});

// Route 3: Time
app.get('/time', (req, res) => {
    res.json({
        currentDateTime: new Date()
    });
});

// Route 4: 404 Error
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Start server
app.listen(3000, () => {
    console.log('Express server running at http://localhost:3000');
});
