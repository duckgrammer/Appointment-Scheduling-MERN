const express = require("express");

const {
  createPatient,
  getPatients,
  getPatientById,
  addAppointment,
  removeAppointment,
} = require("../controllers/patient.controller.js");

const router = express.Router();

router.post("/create", createPatient);
router.get("/getAll", getPatients);
router.get("/getPatient/:patientId", getPatientById);
router.post("/addAppointment/:patientId", addAppointment);
router.delete("/removeAppointment/:patientId", removeAppointment);

module.exports = router;
