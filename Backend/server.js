const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const { protect } = require("./middleware/authMiddleware");
const expertRoutes = require("./routes/expertRouter");
const appointmentRoutes = require("./routes/appointmentRoutes");

dotenv.config();
connectDB();

const app = express();
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://real-time-expert-booking-system-hazel.vercel.app/"
    ],
    credentials: true
};
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*"
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Expert Booking System API is working!");
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/experts", expertRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
