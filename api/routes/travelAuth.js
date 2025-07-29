const express = require('express')
const router = express.Router()
const User = require('../models/travelUsers')
const jwt = require('jsonwebtoken')

// Load environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'fallbackSecret' // fallback just in case

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    // Create and save new user
    const user = new User({ username, password })
    await user.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message })
  }
})

// Login an existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    // Sign JWT using your environment secret
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d'
    })

    res.json({ token, username: user.username })
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
})

module.exports = router
