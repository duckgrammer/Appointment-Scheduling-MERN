const express = require("express");

const {
  createDoctor,
  getDoctors,
  addTime,
  removeTime,
  getDoctorById,
  bookTime,
  unbookTime,
} = require("../controllers/doctor.controller.js");

const router = express.Router();

router.post("/create", createDoctor);
router.get("/getAll", getDoctors);
router.post("/addAvailable/:doctorId", addTime);
router.delete("/removeAvailable/:doctorId", removeTime);
router.get("/getDoctor/:doctorId", getDoctorById);
router.put("/bookTime/:doctorId", bookTime);
router.put("/unbookTime/:doctorId", unbookTime);

module.exports = router;
