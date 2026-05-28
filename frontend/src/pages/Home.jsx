import { useEffect, useState } from "react";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

function Home({ search }) {
    const { showToast } = useToast();

    const [experts, setExperts] =
        useState([]);

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

                    showToast(
                        "Please login first",
                        "warning"
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

                showToast(
                    "Appointment booked successfully",
                    "success"
                );

            } catch (error) {

                console.log(
                    error.response?.data ||
                    error.message
                );

                showToast(
                    error.response?.data?.message ||
                    "Error booking appointment",
                    "error"
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

        <div className="
            min-h-screen
            bg-gray-100
            p-8
        ">

            <h1 className="
                text-4xl
                font-bold
                text-center
                mb-10
            ">
                Explore Experts
            </h1>

            {filteredExperts.length === 0 ? (

                <div className="
                    text-center
                    text-2xl
                    text-gray-500
                    mt-20
                ">
                    No Experts Found
                </div>

            ) : (

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-8
                ">

                    {filteredExperts.map((expert) => (

                        <div
                            key={expert._id}

                            className="
                                bg-white
                                rounded-2xl
                                p-6
                                shadow-md
                                hover:shadow-2xl
                                hover:-translate-y-2
                                transition
                                duration-300
                            "
                        >

                            {/* AVATAR */}

                            <div className="
                                w-16
                                h-16
                                rounded-full
                                bg-black
                                flex
                                items-center
                                justify-center
                                text-white
                                text-2xl
                                font-bold
                                mb-4
                            ">
                                {expert.user.name
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            {/* NAME */}

                            <h2 className="
                                text-2xl
                                font-bold
                                text-black
                                mb-3
                            ">
                                {expert.user.name}
                            </h2>

                            {/* EXPERTISE */}

                            <div className="mb-4">

                                <span className="
                                    bg-red-400
                                    text-black
                                    font-bold
                                    px-3
                                    py-1
                                    rounded-full
                                    text-sm
                                ">
                                    {expert.expertise}
                                </span>

                            </div>

                            {/* EXPERIENCE */}

                            <p className="
                                mb-2
                                text-gray-700
                            ">
                                <span className="
                                    font-semibold
                                ">
                                    Experience:
                                </span>

                                {" "}
                                {expert.experience}
                                {" "}
                                years
                            </p>

                            {/* RATE */}

                            <p className="
                                mb-4
                                text-gray-700
                            ">
                                <span className="
                                    font-semibold
                                ">
                                    Hourly Rate:
                                </span>

                                {" "}
                                ₹{expert.hourlyRate}
                            </p>

                            {/* SKILLS */}

                            <div className="mb-5">

                                <p className="
                                    font-semibold
                                    mb-2
                                ">
                                    Skills:
                                </p>

                                <div className="
                                    flex
                                    flex-wrap
                                    gap-2
                                ">

                                    {expert.skills.map(
                                        (skill, index) => (

                                            <span
                                                key={index}

                                                className="
                                                    bg-gray-200
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    text-sm
                                                "
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )}

                                </div>

                            </div>

                            {/* SHOW SLOT BUTTON */}

                            <button
                                onClick={() =>
                                    fetchAvailableSlots(
                                        expert._id
                                    )
                                }

                                className="
                                    w-full
                                    bg-black
                                    text-white
                                    py-2
                                    rounded-xl
                                    hover:bg-gray-800
                                    transition
                                "
                            >
                                Show Available Slots
                            </button>

                            {/* AVAILABLE DATES */}

                            <div className="
                                mt-4
                                flex
                                flex-wrap
                                gap-3
                            ">

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

                                            className="
                                                bg-black
                                                text-white
                                                px-4
                                                py-2
                                                rounded-lg
                                                hover:bg-red-600
                                                transition
                                            "
                                        >
                                            {date}
                                        </button>

                                    )
                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Home;