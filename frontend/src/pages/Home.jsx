import { useEffect, useState } from "react";
import API from "../services/api";

function Home() {

    const [experts, setExperts] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [slots, setSlots] =
        useState({});

    useEffect(() => {

        fetchExperts();

    }, []);

    const fetchExperts = async () => {

        try {

            const response =
                await API.get("/experts");

            setExperts(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    const fetchAvailableSlots =
        async (expertId) => {

            try {

                const response =
                    await API.get(
                        `/appointments/slots/${expertId}`
                    );

                setSlots((prev) => ({
                    ...prev,
                    [expertId]:
                        response.data.availableDates,
                }));

            } catch (error) {

                console.log(error);
            }
        };

    const handleBookAppointment =
        async (
            expertId,
            appointmentDate
        ) => {

            try {

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    alert(
                        "Please login first"
                    );

                    return;
                }

                const response =
                    await API.post(
                        "/appointments",
                        {
                            expertId,
                            appointmentDate,
                        },
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                console.log(response.data);

                alert(
                    "Appointment booked successfully"
                );

            } catch (error) {

                console.log(
                    error.response?.data ||
                    error.message
                );

                alert(
                    error.response?.data?.message ||
                    "Error booking appointment"
                );
            }
        };

    const filteredExperts =
        experts.filter((expert) => {

            return (

                expert.user.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||

                expert.expertise
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||

                expert.skills.some((skill) =>
                    skill
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
                )
            );
        });

    return (

        <div>

            <h1>All Experts</h1>

            <input
                type="text"
                placeholder="Search experts..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                style={{
                    padding: "10px",
                    width: "300px",
                    marginBottom: "20px",
                }}
            />

            {filteredExperts.map((expert) => (

                <div
                    key={expert._id}
                    style={{
                        border: "1px solid gray",
                        padding: "10px",
                        marginBottom: "10px",
                    }}
                >

                    <h2>
                        {expert.user.name}
                    </h2>

                    <p>
                        Expertise:
                        {" "}
                        {expert.expertise}
                    </p>

                    <p>
                        Experience:
                        {" "}
                        {expert.experience}
                        years
                    </p>

                    <p>
                        Hourly Rate:
                        ₹{expert.hourlyRate}
                    </p>

                    <p>
                        Skills:
                        {" "}
                        {expert.skills.join(", ")}
                    </p>

                    <button
                        onClick={() =>
                            fetchAvailableSlots(
                                expert._id
                            )
                        }
                    >
                        Show Available Slots
                    </button>

                    <br />
                    <br />

                    {slots[expert._id]?.map(
                        (date, index) => (

                            <button
                                key={index}
                                onClick={() =>
                                    handleBookAppointment(
                                        expert._id,
                                        date
                                    )
                                }
                                style={{
                                    marginRight:
                                        "10px",
                                }}
                            >
                                {date}
                            </button>

                        )
                    )}

                </div>

            ))}

        </div>
    );
}

export default Home;