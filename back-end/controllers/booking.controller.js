const Booking = require("../models/booking.js");
const mongoose = require("mongoose");

// Create New Booking
const createBooking = async (req, res) => {
  const doctor = new Booking({
    patientId: req.body.patientId,
    doctorId: req.body.doctorId,
    time: req.body.time,
  });

  try {
    const dataToSave = await doctor.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all booking
const getBookings = async (req, res) => {
  try {
    const target = await Booking.find();
    res.send(target);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by Id
const getBookingById = async (req, res) => {
  try {
    const filter = { _id: new mongoose.Types.ObjectId(req.params.bookingId) };
    const target = await Booking.find(filter);
    res.send(target);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete booking by Id
const deleteBooking = async (req, res) => {
  try {
    const filter = { _id: new mongoose.Types.ObjectId(req.params.bookingId) };
    const target = await Booking.deleteOne(filter);
    res.send(target);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings, getBookingById, deleteBooking };
