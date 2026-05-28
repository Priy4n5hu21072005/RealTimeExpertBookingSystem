const express = require("express");
const router =express.Router();
const {bookAppointment,getAvailableSlots,getMyAppointments}=require("../controllers/appointmentController");
const {protect}=require("../middleware/authMiddleware");
router.post("/",protect,bookAppointment);
router.get("/slots/:expertId",getAvailableSlots);
router.get("/my",protect,getMyAppointments);
module.exports=router;