// 1) Import required packages
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
const database = "mongodb+srv://hungnvtgch230171:CkGtqK8se3xq97y0@doge.40oygcb.mongodb.net/wander-log"
mongoose.connect(database)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection failed:", err))

// 7) Register your main travel routes
const router = require('./api/routes/travelRoute')
router(app)

// 8) Register auth routes (new!)
const authRoutes = require('./api/routes/travelAuth')
app.use('/auth', authRoutes)

// 9) Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`WanderLog backend running at http://localhost:${port}`)
})
