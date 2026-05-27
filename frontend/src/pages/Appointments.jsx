import { useEffect, useState } from "react";

import API from "../services/api";

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

    return (

        <div>

            <h1>
                My Appointments
            </h1>

            {appointments.map(
                (appointment) => (

                    <div
                        key={appointment._id}
                        style={{
                            border:
                                "1px solid gray",
                            padding: "10px",
                            marginBottom:
                                "10px",
                        }}
                    >

                        <h2>
                            Expert:
                            {" "}
                            {
                                appointment
                                    .expert
                                    .user
                                    .name
                            }
                        </h2>

                        <p>
                            Expertise:
                            {" "}
                            {
                                appointment
                                    .expert
                                    .expertise
                            }
                        </p>

                        <p>
                            Date:
                            {" "}
                            {new Date(
                                appointment
                                    .appointmentDate
                            ).toLocaleDateString()}
                        </p>

                        <p>
                            Status:
                            {" "}
                            {
                                appointment
                                    .status
                            }
                        </p>

                    </div>

                )
            )}

        </div>
    );
}

export default Appointments;