const express = require("express");
const router = express.Router();
const {createExpertProfile,getExperts}=require("../controllers/expertController");
const{protect}=require("../middleware/authMiddleware");
router.post("/",protect,createExpertProfile);
router.get("/",getExperts);
module.exports=router;