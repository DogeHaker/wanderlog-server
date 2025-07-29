// import controller
const TravelController = require("../controllers/travelController")
const authenticator = require('../../middlewares/auth')
const upload = require('../../middlewares/upload') 

// declare routes
const TravelRoute = (app) => {
      // Upload route FIRST
    app.post("/travels/upload",upload.single('image'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`
        res.status(200).json({ imageUrl: fileUrl })
        })
    // group API without id
    app.route("/travels")
        .get(authenticator, TravelController.viewAllTravels)
        .post(authenticator, upload.none(), TravelController.createTravel)
        .delete(authenticator, TravelController.deleteAllTravels)

    // group API with id
    app.route("/travels/:id")
        .get(authenticator, TravelController.viewTravelById)
        .put(authenticator, TravelController.updateTravel)
        .delete(authenticator, TravelController.deleteTravel)
}

// export route
module.exports = TravelRoute

