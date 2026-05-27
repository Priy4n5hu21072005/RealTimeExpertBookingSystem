const express = require("express");
const dotenv =require("dotenv");
const cors=require("cors");
const connectDB =require("./config/db");
const User=require("./models/User");
const authRoutes = require("./routes/authRoute");
const {protect}=require("./middleware/authMiddleware");
const expertRoutes = require("./routes/expertRouter");
const appointmentRoutes = require("./routes/appointmentRoutes");
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/experts",expertRoutes);
app.use("/api/appointments",appointmentRoutes);
app.get("/",(req,res)=>{
    res.send("Expert Booking System API is working!");
});

app.use("/api/auth",authRoutes);
const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`server is runninng on port ${PORT}`);
});

app.get("/api/protected",protect,(req,res)=>{
    res.json({message:"Protected route accessed",
        user:req.user,
    });
});