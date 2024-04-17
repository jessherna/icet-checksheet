const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const Checksheet = require('./models/Checksheet');

const app = express();
const server = http.createServer(app);

const checksheetRouter = require('./routes/checksheetRoutes');
const scheduleRouter = require('./routes/scheduleRoutes');

const mongoUrl = process.env.MONGO_URL;

async function getUpdatedChecksheet(id) {
    const updatedChecksheet = await Checksheet.findById(id);
    return updatedChecksheet;
}

mongoose.connect(mongoUrl)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Serve static assets from the 'dist' directory
app.use(express.static(path.join(__dirname, 'client/dist')));

// Serve index.html for all other routes to enable client-side routing
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/dist/', 'index.html'));
});

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const io = require("socket.io")(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});



app.use('/checksheet', checksheetRouter);
app.use('/schedule', scheduleRouter);

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('scheduleUploaded', () => console.log('Schedule uploaded'));
    socket.on('checksheetUpdated', async ({ id }) => {
        const updatedChecksheet = await getUpdatedChecksheet(id);
        io.emit('checksheetUpdated', updatedChecksheet);
    });
    socket.on('scheduleUpdated', () => console.log('Schedule updated'));
    socket.on('disconnect', () => console.log('Client disconnected'));
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));