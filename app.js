// 1) Import required packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

// 2) Initialize Express app
const app = express()

// 3) Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

// 4) Enable CORS
app.use(cors())

// 5) Parse incoming request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 6) Serve static uploads folder
app.use('/uploads', express.static('uploads'))

// 7) MongoDB connection
const mongoUri = process.env.MONGO_URI
mongoose.connect(mongoUri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection failed:", err))

// 8) Register main travel routes
const router = require('./api/routes/travelRoute')
router(app)

// 9) Register auth routes
const authRoutes = require('./api/routes/travelAuth')
app.use('/auth', authRoutes)

// 10) Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`WanderLog backend is running!`)
})