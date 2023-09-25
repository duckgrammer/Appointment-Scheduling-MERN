const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const patientSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  bookedTimes: {
    type: [Date],
    required: true,
  },
  bookings: {
    type: [ObjectId],
    required: true,
  },
});

module.exports = Patient = mongoose.model("Patient", patientSchema);
