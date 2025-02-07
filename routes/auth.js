// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../knexfile').development);
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey'; // Change in production

// User Registration
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    try {
      // Check if user exists
      const existingUser = await knex('users').where({ email }).first();
      if (existingUser) return res.status(400).json({ message: 'Email already in use' });

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      await knex('users').insert({ username, email, password: hashedPassword });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Registration error:', err);  // Log the full error to the console
      res.status(500).json({ message: 'Server error', error: err });
    }
  }
);


// User Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await knex('users').where({ email }).first();
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      // Generate JWT Token
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

      res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  }
);

module.exports = router;
