const express = require("express");

const {
  createBooking,
  getBookings,
  getBookingById,
  deleteBooking,
} = require("../controllers/booking.controller.js");

const router = express.Router();

router.post("/create", createBooking);
router.get("/getAll", getBookings);
router.get("/getBooking/:bookingId", getBookingById);
router.delete("/removeBooking/:bookingId", deleteBooking);

module.exports = router;
