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

// --------------- CORS ---------------
const allowedOrigins = [
    process.env.CLIENT_URL,
].filter(Boolean).map((origin) => origin.replace(/\/$/, ""));

// In development, also allow localhost
if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push("http://localhost:5173");
    allowedOrigins.push("http://localhost:3000");
}

const corsOptions = {
    origin(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) {
            return callback(null, true);
        }

        const normalizedOrigin = origin.replace(/\/$/, "");

        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// --------------- Health / Root ---------------
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

// --------------- API Routes ---------------
app.use("/api/auth", authRoutes);
app.use("/api/experts", expertRoutes);
app.use("/api/appointments", appointmentRoutes);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
