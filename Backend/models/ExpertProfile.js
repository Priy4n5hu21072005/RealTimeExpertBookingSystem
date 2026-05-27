const mongoose = require("mongoose");
const expertProfileSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    expertise:{
        type:String,
        required:true,
    },
    bio:{
        type : String,
        required:true,
    },
    experience:{
        type:Number,
        required:true,
    },
    skills:[
        {
            type:String,
        },
    ],
    hourlyRate:{
        type:Number,
        required:true,
    },
},
{
    timestamps:true,

});
module.exports=mongoose.model("ExpertProfile",expertProfileSchema);