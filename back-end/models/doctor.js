const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  availableTimes: {
    type: [Date],
    required: true,
  },
  bookings: {
    type: [ObjectId],
    required: true,
  },
});

module.exports = Doctor = mongoose.model("Doctor", doctorSchema);
