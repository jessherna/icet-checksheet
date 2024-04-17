const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const checksheetRouter = require('./routes/checksheetRoutes');
const scheduleRouter = require('./routes/scheduleRoutes');

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Server is running');
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
    socket.on('checksheetUpdated', (data) => console.log(`Checksheet updated: ${data.id}`));
    socket.on('scheduleUpdated', () => console.log('Schedule updated'));
    socket.on('disconnect', () => console.log('Client disconnected'));
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));