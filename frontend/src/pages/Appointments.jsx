import { useEffect, useState } from "react";

import API from "../services/api";

const formatTime = (time) => {
    if (!time) {
        return "Not selected";
    }

    const [hours, minutes] =
        time.split(":").map(Number);
    const date =
        new Date(2000, 0, 1, hours, minutes);

    return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });
};

function Appointments() {

    const [appointments, setAppointments] =
        useState([]);

    useEffect(() => {

        fetchAppointments();

    }, []);

    const fetchAppointments =
        async () => {

            try {

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response =
                    await API.get(
                        "/appointments/my",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                setAppointments(
                    response.data
                );

            } catch (error) {

                console.log(error);
            }
        };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'accepted':
            case 'approved':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'rejected':
            case 'cancelled':
                return 'bg-red-100 text-red-800 border border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-4xl font-bold text-center mb-10">
                My Appointments
            </h1>

            {appointments.length === 0 ? (
                <div className="text-center text-2xl text-gray-500 mt-20">
                    No Appointments Found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {appointments.map(
                        (appointment) => (

                            <div
                                key={appointment._id}
                                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300"
                            >

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white text-xl font-bold">
                                        {appointment.expert?.user?.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "?"}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-black">
                                            {appointment.expert?.user?.name || "Unknown Expert"}
                                        </h2>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                            {appointment.expert?.expertise || "Expert"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-gray-100 pt-4 text-gray-700">
                                    <p className="flex justify-between">
                                        <span className="font-semibold text-gray-500">Date:</span>
                                        <span>
                                            {new Date(
                                                appointment.appointmentDate
                                            ).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </p>

                                    <p className="flex justify-between">
                                        <span className="font-semibold text-gray-500">Time:</span>
                                        <span>
                                            {formatTime(appointment.appointmentTime)}
                                        </span>
                                    </p>

                                    <p className="flex justify-between">
                                        <span className="font-semibold text-gray-500">Duration:</span>
                                        <span>
                                            {appointment.durationHours
                                                ? `${appointment.durationHours} ${appointment.durationHours === 1 ? "hour" : "hours"}`
                                                : "Not selected"}
                                        </span>
                                    </p>

                                    <p className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-500">Status:</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase border ${getStatusBadgeClass(appointment.status)}`}>
                                            {appointment.status || "pending"}
                                        </span>
                                    </p>
                                </div>

                            </div>

                        )
                    )}
                </div>
            )}

        </div>
    );
}

export default Appointments;
