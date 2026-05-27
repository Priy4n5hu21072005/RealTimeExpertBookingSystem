const Appointment = require("../models/Appointment");

const bookAppointment = async (req, res) => {
    try {

        const {
            expertId,
            appointmentDate,
        } = req.body;

        const existingAppointment =
            await Appointment.findOne({
                expert: expertId,
                appointmentDate,
            });

        if (existingAppointment) {
            return res.status(400).json({
                message:
                    "This slot is already booked",
            });
        }

        const appointment =
            await Appointment.create({
                customer: req.user._id,
                expert: expertId,
                appointmentDate,
            });

        res.status(201).json({
            message:
                "Appointment booked successfully",
            appointment,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const getAvailableSlots = async (req,res)=>{
    try{
        const {expertId}=req.params;
        const appointments = await Appointment.find({expert:expertId});
        const bookedDates=appointments.map(app=>app.appointmentDate.toISOString().split("T")[0]);
        const availableDates=[];
        let currentDate = new Date();
        while (availableDates.length<3){
            currentDate.setDate(currentDate.getDate()+1);
            const formattedDate = currentDate.toISOString().split("T")[0];
            if (!bookedDates.includes(formattedDate)){
                availableDates.push(formattedDate);
            }
        }
        res.status(200).json({availableDates});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

module.exports = {
    bookAppointment,
    getAvailableSlots,
};