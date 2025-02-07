// index.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

// Serve static files (we’ll place our Vue front end in the public folder)
app.use(express.static('public'));

// API endpoint example (e.g., for user registration later)
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Basic Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send a welcome message or simple notification
  socket.emit('welcome', 'Welcome to Wrestleverse!');

  // Listen for events (like dice rolls, wrestler actions, etc.)
  socket.on('rollDice', (data) => {
    // Here you could simulate a dice roll based on wrestler stats
    const result = Math.floor(Math.random() * 20) + 1;
    socket.emit('diceResult', { result, detail: 'Basic roll outcome' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
