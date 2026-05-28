const Appointment = require("../models/Appointment");

const getDateOnly = (date) =>
    new Date(date).toISOString().split("T")[0];

const parseAppointmentDate = (date) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return new Date(`${date}T00:00:00`);
    }

    return new Date(date);
};

const isValidTime = (time) =>
    /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

const getEndTime = (startTime, durationHours) => {
    const [hours, minutes] =
        startTime.split(":").map(Number);
    const endDate =
        new Date(2000, 0, 1, hours + durationHours, minutes);

    return `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
};

const bookAppointment = async (req, res) => {
    try {

        const {
            expertId,
            appointmentDate,
            appointmentTime,
            durationHours,
        } = req.body;

        if (!expertId || !appointmentDate) {
            return res.status(400).json({
                message:
                    "Expert and appointment date are required",
            });
        }

        const selectedDate =
            parseAppointmentDate(appointmentDate);

        if (Number.isNaN(selectedDate.getTime())) {
            return res.status(400).json({
                message:
                    "Please choose a valid appointment date",
            });
        }

        const hasCustomTime =
            Boolean(appointmentTime || durationHours);
        const selectedDuration =
            Number(durationHours);

        if (hasCustomTime) {
            if (!appointmentTime || !isValidTime(appointmentTime)) {
                return res.status(400).json({
                    message:
                        "Please choose a valid appointment time",
                });
            }

            if (
                !Number.isInteger(selectedDuration) ||
                selectedDuration < 1 ||
                selectedDuration > 8
            ) {
                return res.status(400).json({
                    message:
                        "Please choose appointment duration between 1 and 8 hours",
                });
            }

            const [hours, minutes] =
                appointmentTime.split(":").map(Number);
            selectedDate.setHours(hours, minutes, 0, 0);
        }

        const startOfDay =
            new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay =
            new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const appointmentEndDate =
            hasCustomTime
                ? new Date(
                    selectedDate.getTime() +
                    selectedDuration * 60 * 60 * 1000
                )
                : undefined;

        const existingAppointment = hasCustomTime
            ? await Appointment.findOne({
                expert: expertId,
                $or: [
                    {
                        appointmentEndDate: {
                            $exists: true,
                            $gt: selectedDate,
                        },
                        appointmentDate: {
                            $lt: appointmentEndDate,
                        },
                    },
                    {
                        appointmentEndDate: {
                            $exists: false,
                        },
                        appointmentDate: {
                            $gte: startOfDay,
                            $lte: endOfDay,
                        },
                    },
                ],
            })
            : await Appointment.findOne({
                expert: expertId,
                appointmentDate: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
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
                appointmentDate: selectedDate,
                appointmentTime:
                    hasCustomTime ? appointmentTime : undefined,
                durationHours:
                    hasCustomTime ? selectedDuration : undefined,
                appointmentEndDate,
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
        const bookedDates=appointments.map(app=>getDateOnly(app.appointmentDate));
        const bookedSlots=appointments.map((app)=>{
            const appointmentDate =
                getDateOnly(app.appointmentDate);

            return {
                date: appointmentDate,
                startTime: app.appointmentTime,
                durationHours: app.durationHours,
                endTime:
                    app.appointmentTime && app.durationHours
                        ? getEndTime(app.appointmentTime, app.durationHours)
                        : undefined,
                hasCustomTime:
                    Boolean(app.appointmentTime && app.durationHours),
            };
        });
        const availableDates=[];
        let currentDate = new Date();
        while (availableDates.length<3){
            currentDate.setDate(currentDate.getDate()+1);
            const formattedDate = getDateOnly(currentDate);
            if (!bookedDates.includes(formattedDate)){
                availableDates.push(formattedDate);
            }
        }
        res.status(200).json({availableDates,bookedDates,bookedSlots});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};
const getMyAppointments =
    async (req, res) => {

        try {

            const appointments =
                await Appointment.find({
                    customer:
                        req.user._id,
                })
                    .populate({
                        path: "expert",
                        populate: {
                            path: "user",
                            select:
                                "name email",
                        },
                    });

            res.status(200).json(
                appointments
            );

        } catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });
        }
    };

module.exports = {
    bookAppointment,
    getAvailableSlots,
    getMyAppointments,
};
