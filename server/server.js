const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const checksheetRouter = require('./routes/checksheetRoutes');
const scheduleRouter = require('./routes/scheduleRoutes');

const mongoUrl = 'mongodb://icetclass:Seta5b1pa55@15.156.204.35:27017/'; // Replace with your MongoDB connection string

mongoose.connect(mongoUrl)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use(express.json());
app.use(cors());
app.use('/checksheet', checksheetRouter);
app.use('/schedule', scheduleRouter);

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('scheduleUploaded', () => console.log('Schedule uploaded'));
    socket.on('disconnect', () => console.log('Client disconnected'));
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));