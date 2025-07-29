// import mongoose
const mongoose = require('mongoose');

// Wander log schema
const TravelSchema = new mongoose.Schema({
    userId: { 
        type: String,
        required: true 
    }, // simulate with 'demo123' for now
    place: {
        type: String, 
        required: true 
    },
    notes: { 
        type: String, 
        default: "" 
    },
    status: { 
        type: String, 
        enum: ['visited', 'wishlist'], 
        default: 'wishlist' 
    },
    imageUrl: {
        type: String,
        default: ""
    },
    favorite: { 
        type: Boolean, 
        default: false 
    }, // optional toggle
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    travelDate: {
        type: Date,
        default: null
    }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

// export model (must include collection name: "travels")
const Travel = mongoose.model("Travels", TravelSchema)
module.exports = Travel
