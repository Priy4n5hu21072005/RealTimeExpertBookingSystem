const express = require("express");
const router =express.Router();
const {bookAppointment,getAvailableSlots}=require("../controllers/appointmentController");
const {protect}=require("../middleware/authMiddleware");
router.post("/",protect,bookAppointment);
router.get("/slots/:expertId",getAvailableSlots);
module.exports=router;