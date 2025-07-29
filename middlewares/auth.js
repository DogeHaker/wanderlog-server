// middleware/auth.js
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sigmaskibidi' // MUST match the one used in travelAuth.js

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // now available in your controllers
    next()
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}