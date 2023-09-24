const mongoose = require("mongoose");
const Doctor = require("../models/doctor.js");

// create a new doctor
const createDoctor = async (req, res) => {
  const doctor = new Doctor({
    name: req.body.name,
    availableTimes: [],
    bookings: [],
  });

  try {
    const dataToSave = await doctor.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctor = await Doctor.find();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add avaialable time slot for an existing doctior by id
const addTime = async (req, res) => {
  try {
    const filter = { _id: new mongoose.Types.ObjectId(req.params.doctorId) };
    const targetDoctor = await Doctor.findOneAndUpdate(filter, {
      $addToSet: { availableTimes: req.body.time },
    });
    res.send(targetDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove avaialable time slot for an existing doctior by id
const removeTime = async (req, res) => {
  try {
    const filter = { _id: new mongoose.Types.ObjectId(req.params.doctorId) };
    const targetDoctor = await Doctor.findOneAndUpdate(filter, {
      $pull: { availableTimes: req.body.time },
    });
    res.send(targetDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get existing doctior by id
const getDoctorById = async (req, res) => {
  try {
    const filter = { _id: new mongoose.Types.ObjectId(req.params.doctorId) };
    const doctor = await Doctor.find(filter);
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book time slot for doctor by id
const bookTime = async (req, res) => {
  try {
    const filter = { _id: new mongoose.Types.ObjectId(req.params.doctorId) };
    const targetDoctor = await Doctor.findOneAndUpdate(filter, {
      $pull: { availableTimes: req.body.time },
      $addToSet: { bookings: req.body.bookingId },
    });
    res.send(targetDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unbook time slot by id
const unbookTime = async (req, res) => {
  try {
    const filter = { _id: new mongoose.Types.ObjectId(req.params.doctorId) };
    const targetDoctor = await Doctor.findOneAndUpdate(filter, {
      $pull: { bookings: req.body.bookingId },
      $addToSet: { availableTimes: req.body.time },
    });
    res.send(targetDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  addTime,
  removeTime,
  getDoctorById,
  bookTime,
  unbookTime,
};
