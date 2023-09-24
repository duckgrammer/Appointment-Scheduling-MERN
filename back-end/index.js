const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const VerifyToken = require("./middlewares/VerifyToken");

dotenv.config({
  path: "./config.env",
});

const app = express();
const dataRoute = express.Router();
const PORT = process.env.PORT || 3000;
const dbURL = process.env.DATABASE_URL;

mongoose.connect(dbURL);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.use(cors()); // Allow cross-origin requests (for frontend to communicate with backend on different ports/address)
app.use(express.json()); // Parses incoming JSON requests and uts the parsed data in req
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with urlenconded payloads
//app.use('/', VerifyToken, require('./firebase-express-auth/dataRoute'));

/**
 * Uses the VerifyToken middleware to protect the data route
 * Use the VerifyToken to protect all routes that require authentication
 */
dataRoute.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/doctor", require("./routes/doctor.router.js"));
app.use("/patient", require("./routes/patient.router.js"));
app.use("/booking", require("./routes/booking.router.js"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
