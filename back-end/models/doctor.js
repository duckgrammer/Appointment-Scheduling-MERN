const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  availableTimes: {
    type: [Date],
    required: true,
  },
  bookedTimes: {
    type: [Date],
    required: true,
  },
});

module.exports = Doctor = mongoose.model("Doctor", doctorSchema);
