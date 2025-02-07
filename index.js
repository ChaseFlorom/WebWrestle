// index.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

// Initialize the Express app first
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (we’ll place our Vue front end in the public folder)
app.use(express.static('public'));

// API endpoint example (e.g., for user registration later)
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Create the HTTP server using the Express app
const http = require('http').createServer(app);
// Initialize Socket.IO with the HTTP server
const io = require('socket.io')(http);

// Basic Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send a welcome message or simple notification
  socket.emit('welcome', 'Welcome to Wrestleverse!');

  // Listen for events (like dice rolls, wrestler actions, etc.)
  socket.on('rollDice', (data) => {
    // Simulate a dice roll (1-20)
    const result = Math.floor(Math.random() * 20) + 1;
    socket.emit('diceResult', { result, detail: 'Basic roll outcome' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the HTTP server (which includes Socket.IO)
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});