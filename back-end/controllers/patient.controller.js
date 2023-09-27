const Patient = require("../models/patient.js");

// Create New Patient with Firebase ID
const createPatient = async (req, res) => {
  const doctor = new Patient({
    _id: req.body._id,
    bookedTimes: [],
    bookings: [],
  });

  try {
    const dataToSave = await doctor.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all patient
const getPatients = async (req, res) => {
  try {
    const patient = await Patient.find();
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Patient by ID
const getPatientById = async (req, res) => {
  try {
    const filter = { _id: req.params.patientId };
    const patient = await Patient.find(filter);
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book Appontment
const addAppointment = async (req, res) => {
  try {
    const filter = { _id: req.params.patientId };
    const targetAppointment = await Patient.findOneAndUpdate(filter, {
      $addToSet: {
        bookings: req.body.bookingId,
        bookedTimes: req.body.time,
      },
    });
    res.send(targetAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unbook Appointment
const removeAppointment = async (req, res) => {
  try {
    const filter = { _id: req.params.patientId };
    const targetAppointment = await Patient.findOneAndUpdate(filter, {
      $pull: {
        bookings: req.body.bookingId,
        bookedTimes: req.body.time,
      },
    });
    res.send(targetAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  addAppointment,
  removeAppointment,
};
