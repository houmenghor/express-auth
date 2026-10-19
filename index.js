const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const authRoutes = require('./routes/auth.route');
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((req, res) => {
    return res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: err.message
    });
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});