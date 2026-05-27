const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    expert:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    appointmentDate:{
        type:Date,
        required:true,
    },
    status:{
        type:String,
        enum:["pending","confirmed","completed","cancelled"],
        default:"pending",
    },
},
{
    timestamps:true,
});
module.exports=mongoose.model("Appointment",appointmentSchema);