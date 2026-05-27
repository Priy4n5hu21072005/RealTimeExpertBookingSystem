const ExpertProfile = require("../models/ExpertProfile");
const createExpertProfile = async (req,res)=>{
    try{
        const{
            expertise,
            bio,
            experience,
            skills,
            hourlyRate,
        }=req.body;
        const expertProfile = await ExpertProfile.create({
            user:req.user._id,
            expertise,
            bio,
            experience,
            skills,hourlyRate,
        });
        res.status(201).json(expertProfile);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};
const getExperts = async (req,res)=>{
        try{
            const keyword = req.query.keyword
            ?{
                expertise:{
                    $regex:req.query.keyword,
                    $options:"i",
                },
            }
            :{};
            const experts = await ExpertProfile.find({...keyword}).populate("user","name email");
            res.status(200).json(experts);
        }
         catch(error){
            res.status(500).json({
                message:error.message,
            });
         }
    };
module.exports={createExpertProfile,getExperts};