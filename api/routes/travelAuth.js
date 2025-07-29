const express = require('express')
const router = express.Router()
const User = require('../models/travelUsers')
const jwt = require('jsonwebtoken')

// Secret key for JWT
const JWT_SECRET = 'sigmaskibidi' // move to .env later

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    const user = new User({ username, password })
    await user.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err })
  }
})

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d'
    })

    res.json({ token, username: user.username })
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err })
  }
})

module.exports = router
