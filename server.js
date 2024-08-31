const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/xyleBooking", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Schemas and Models
const bookingSchema = new mongoose.Schema({
  teamName: String,
  whatsappNum: String,
  yourName: String,
  uniqueId: String,
  timestamp: { type: Date, default: Date.now },
});

const deletedBookingSchema = new mongoose.Schema({
  teamName: String,
  whatsappNum: String,
  yourName: String,
  uniqueId: String,
  timestamp: Date,
  deletedAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);
const DeletedBooking = mongoose.model("DeletedBooking", deletedBookingSchema);

// Serve the index.html from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the admin-related files from the 'admin' directory
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve the index.html file on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the admin.html file on the /admin route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'admin.html'));
});

// Serve the deleted.html file on the /admin/deleted route
app.get('/admin/deleted', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'deleted.html'));
});

// API Routes
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/deleted-bookings", async (req, res) => {
  try {
    const deletedBookings = await DeletedBooking.find();
    res.json(deletedBookings);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete all bookings and move them to the deleted bookings collection
app.delete("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();

    if (bookings.length > 0) {
      const deletedBookings = bookings.map((booking) => ({
        teamName: booking.teamName,
        whatsappNum: booking.whatsappNum,
        yourName: booking.yourName,
        uniqueId: booking.uniqueId,
        timestamp: booking.timestamp,
        deletedAt: new Date(),
      }));

      await DeletedBooking.insertMany(deletedBookings);

      await Booking.deleteMany();

      res.json({
        success: true,
        message: "All bookings have been canceled and archived successfully",
      });
    } else {
      res.json({ success: false, message: "No bookings to cancel" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Handle form submission and save booking
app.post("/api/book-slot", async (req, res) => {
  const { teamName, whatsappNum, yourName } = req.body;

  const uniqueId = `${teamName.replace(/\s+/g, "-").toUpperCase()}-${Math.floor(
    Math.random() * 1000000
  )}`;

  const newBooking = new Booking({
    teamName,
    whatsappNum,
    yourName,
    uniqueId,
    timestamp: new Date(),
  });

  try {
    const savedBooking = await newBooking.save();
    res.json({ success: true, uniqueId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel (delete) a booking and save it to the deleted collection
app.delete("/api/bookings/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;
  try {
    const booking = await Booking.findOneAndDelete({ uniqueId: uniqueId });
    if (booking) {
      const deletedBooking = new DeletedBooking({
        teamName: booking.teamName,
        whatsappNum: booking.whatsappNum,
        yourName: booking.yourName,
        uniqueId: booking.uniqueId,
        timestamp: booking.timestamp,
        deletedAt: new Date(),
      });

      await deletedBooking.save();

      res.json({
        success: true,
        message: "Booking canceled and archived successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "Booking not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
