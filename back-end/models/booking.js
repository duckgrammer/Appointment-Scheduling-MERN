const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  doctorId: {
    type: ObjectId,
    required: true,
  },
});

module.exports = Booking = mongoose.model("Booking", bookingSchema);
