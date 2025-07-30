const Travel = require('../models/travelModel')

// GET: view all logs (with optional filters)
const viewAllTravels = async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ message: 'Missing or invalid token' })

  try {
    const filter = { userId }

    if (req.query.status) {
      filter.status = req.query.status
    }
    if (req.query.favorite === 'true') {
      filter.favorite = true
    }
    if (req.query.q) {
      filter.place = { $regex: req.query.q, $options: 'i' }
    }

    const sortOrder = req.query.sort === 'asc' ? 1 : -1
    const travels = await Travel.find(filter).sort({ createdAt: sortOrder })

    res.status(200).json(travels)
  } catch (err) {
    res.status(500).send(err)
  }
}

const viewTravelById = async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ message: 'Missing or invalid token' })

  try {
    const travel = await Travel.findOne({ _id: req.params.id, userId })
    travel
      ? res.status(200).json(travel)
      : res.status(404).json({ message: 'Travel log not found' })
  } catch (err) {
    res.status(500).send(err)
  }
}

const createTravel = async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ message: 'Missing or invalid token' })

  try {
    const { place, notes, status, favorite, imageUrl, travelDate } = req.body

    // Determine actual status
    let finalStatus = status
    if (
      status === 'wishlist' &&
      travelDate &&
      new Date(travelDate) > new Date()
    ) {
      finalStatus = 'planned'
    }

    const newTravel = {
      userId,
      place,
      notes,
      status: finalStatus,
      favorite: favorite || false,
      imageUrl: imageUrl || '',
      travelDate: travelDate || null
    }

    await Travel.create(newTravel)
    res.status(201).json(newTravel)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateTravel = async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ message: 'Missing or invalid token' })

  try {
    const { place, notes, status, favorite, imageUrl, travelDate } = req.body

    // Determine correct status
    let finalStatus = status
    if (status === 'wishlist' && travelDate && new Date(travelDate) > new Date()) {
      finalStatus = 'planned'
    }

    // Only allow updating these fields — createdAt is NOT included
    const update = {
      place,
      notes,
      favorite,
      imageUrl,
      travelDate,
      status: finalStatus
    }

    const result = await Travel.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: update },
      { new: true }
    )

    if (!result) {
      return res.status(404).json({ message: 'Travel log not found' })
    }

    res.json({ message: 'Update travel log succeed!' })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteTravel = async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ message: 'Missing or invalid token' })

  try {
    await Travel.findOneAndDelete({ _id: req.params.id, userId })
    res.json({ message: 'Delete travel log succeed' })
  } catch (err) {
    res.status(500).send(err)
  }
}

const deleteAllTravels = async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ message: 'Missing or invalid token' })

  try {
    await Travel.deleteMany({ userId })
    res.json({ message: 'Delete all travels succeed' })
  } catch (err) {
    res.status(500).json(err)
  }
}

module.exports = {
  createTravel,
  viewAllTravels,
  viewTravelById,
  updateTravel,
  deleteTravel,
  deleteAllTravels
}