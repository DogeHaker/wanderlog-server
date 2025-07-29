// 1) Import required packages
require('dotenv').config() // ✅ Load environment variables from .env
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// 2) Initialize Express app
const app = express()

// 3) Enable CORS (for development, allow all origins)
app.use(cors())

// 4) Parse incoming request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 5) Serve static uploads folder
app.use('/uploads', express.static('uploads'))

// 6) MongoDB connection
const mongoUri = process.env.MONGO_URI

mongoose.connect(mongoUri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection failed:", err))

// 7) Register main travel routes
const router = require('./api/routes/travelRoute')
router(app)

// 8) Register auth routes
const authRoutes = require('./api/routes/travelAuth')
app.use('/auth', authRoutes)

// 9) Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`WanderLog backend is running!`)
})