const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const { protect } = require("./middleware/authMiddleware");
const expertRoutes = require("./routes/expertRouter");
const appointmentRoutes = require("./routes/appointmentRoutes");

dotenv.config();

const app = express();
const normalizeOrigin = (origin) =>
    origin?.replace(/\/$/, "");

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://real-time-expert-booking-system-hazel.vercel.app",
    ...(process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
        : []),
]
    .filter(Boolean)
    .map(normalizeOrigin);

const corsOptions = {
    origin(origin, callback) {
        if (
            !origin ||
            allowedOrigins.includes("*") ||
            allowedOrigins.includes(normalizeOrigin(origin))
        ) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Expert Booking System API is working!");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        database:
            require("mongoose").connection.readyState === 1
                ? "connected"
                : "disconnected",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/experts", expertRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use("/auth", authRoutes);
app.use("/experts", expertRoutes);
app.use("/appointments", appointmentRoutes);

app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user,
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();

module.exports = app;
