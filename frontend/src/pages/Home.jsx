import { useEffect, useState } from "react";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
});

const timeOptions = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
];

const durationOptions = [1, 2, 3, 4, 5, 6, 7, 8];

const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getTodayKey = () => getDateKey(new Date());

const getMonthStart = (date = new Date()) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

const getCalendarDays = (monthDate) => {
    const monthStart = getMonthStart(monthDate);
    const firstDay = monthStart.getDay();
    const daysInMonth =
        new Date(
            monthStart.getFullYear(),
            monthStart.getMonth() + 1,
            0
        ).getDate();

    return [
        ...Array.from(
            { length: firstDay },
            () => null
        ),
        ...Array.from(
            { length: daysInMonth },
            (_, index) =>
                new Date(
                    monthStart.getFullYear(),
                    monthStart.getMonth(),
                    index + 1
                )
        ),
    ];
};

const timeToMinutes = (time) => {
    const [hours, minutes] =
        time.split(":").map(Number);

    return hours * 60 + minutes;
};

const formatTime = (time) => {
    const [hours, minutes] =
        time.split(":").map(Number);
    const date =
        new Date(2000, 0, 1, hours, minutes);

    return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });
};

const hasTimeConflict = (
    bookedSlots,
    selectedDate,
    selectedTime,
    durationHours
) => {
    const selectedStart =
        timeToMinutes(selectedTime);
    const selectedEnd =
        selectedStart + durationHours * 60;

    return bookedSlots.some((slot) => {
        if (slot.date !== selectedDate) {
            return false;
        }

        if (!slot.hasCustomTime) {
            return true;
        }

        const bookedStart =
            timeToMinutes(slot.startTime);
        const bookedEnd =
            bookedStart + slot.durationHours * 60;

        return selectedStart < bookedEnd &&
            selectedEnd > bookedStart;
    });
};

function Home({ search }) {
    const { showToast } = useToast();

    const [experts, setExperts] =
        useState([]);

    const [slots, setSlots] =
        useState({});

    const [bookedSlots, setBookedSlots] =
        useState({});

    const [calendarMonths, setCalendarMonths] =
        useState({});

    const [selectedDates, setSelectedDates] =
        useState({});

    const [selectedTimes, setSelectedTimes] =
        useState({});

    const [selectedDurations, setSelectedDurations] =
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

                setBookedSlots((prev) => ({
                    ...prev,

                    [expertId]:
                        response.data.bookedSlots || [],
                }));

                setCalendarMonths((prev) => ({
                    ...prev,

                    [expertId]:
                        prev[expertId] || getMonthStart(),
                }));

            } catch (error) {
            }
        };

    const handleBookAppointment =
        async (
            expertId,
            appointmentDate,
            options = {}
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
                            ...options,
                        },
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                showToast(
                    "Appointment booked successfully",
                    "success"
                );

                setSelectedDates((prev) => ({
                    ...prev,

                    [expertId]: "",
                }));

                setSelectedTimes((prev) => ({
                    ...prev,

                    [expertId]: "",
                }));

                fetchAvailableSlots(expertId);

            } catch (error) {

                showToast(
                    error.response?.data?.message ||
                    "Error booking appointment",
                    "error"
                );
            }
        };

    const moveCalendarMonth = (expertId, direction) => {
        setCalendarMonths((prev) => {
            const currentMonth =
                prev[expertId] || getMonthStart();

            return {
                ...prev,

                [expertId]:
                    new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + direction,
                        1
                    ),
            };
        });
    };

    const renderCalendar = (expert) => {
        const expertId = expert._id;
        const monthDate =
            calendarMonths[expertId] || getMonthStart();
        const todayKey = getTodayKey();
        const selectedDate =
            selectedDates[expertId] || "";
        const selectedTime =
            selectedTimes[expertId] || "";
        const selectedDuration =
            selectedDurations[expertId] || 1;
        const expertBookedSlots =
            bookedSlots[expertId] || [];
        const fullDayBookedDates =
            expertBookedSlots
                .filter((slot) => !slot.hasCustomTime)
                .map((slot) => slot.date);
        const calendarDays =
            getCalendarDays(monthDate);
        const currentMonthStart =
            getMonthStart();
        const isCurrentMonth =
            monthDate.getFullYear() ===
                currentMonthStart.getFullYear() &&
            monthDate.getMonth() ===
                currentMonthStart.getMonth();

        return (
            <div className="
                mt-5
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                p-4
            ">
                <div className="
                    flex
                    items-center
                    justify-between
                    gap-3
                ">
                    <button
                        type="button"
                        onClick={() =>
                            moveCalendarMonth(expertId, -1)
                        }
                        disabled={isCurrentMonth}
                        className="
                            h-9
                            w-9
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            text-lg
                            font-bold
                            text-gray-700
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                            hover:bg-gray-100
                        "
                        aria-label="Previous month"
                    >
                        {"<"}
                    </button>

                    <div className="text-center">
                        <p className="
                            text-sm
                            font-bold
                            text-black
                        ">
                            {monthFormatter.format(monthDate)}
                        </p>
                        <p className="
                            text-xs
                            text-gray-500
                        ">
                            Choose a custom date
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            moveCalendarMonth(expertId, 1)
                        }
                        className="
                            h-9
                            w-9
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            text-lg
                            font-bold
                            text-gray-700
                            hover:bg-gray-100
                        "
                        aria-label="Next month"
                    >
                        {">"}
                    </button>
                </div>

                <div className="
                    mt-4
                    grid
                    grid-cols-7
                    gap-1
                    text-center
                    text-xs
                    font-bold
                    text-gray-500
                ">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                            <span key={day}>
                                {day}
                            </span>
                        )
                    )}
                </div>

                <div className="
                    mt-2
                    grid
                    grid-cols-7
                    gap-1
                ">
                    {calendarDays.map((day, index) => {
                        if (!day) {
                            return (
                                <span
                                    key={`blank-${index}`}
                                    className="h-10"
                                />
                            );
                        }

                        const dateKey = getDateKey(day);
                        const isPast =
                            dateKey < todayKey;
                        const isBooked =
                            fullDayBookedDates.includes(dateKey);
                        const isSelected =
                            selectedDate === dateKey;
                        const isDisabled =
                            isPast || isBooked;

                        return (
                            <button
                                key={dateKey}
                                type="button"
                                disabled={isDisabled}
                                onClick={() =>
                                    {
                                        setSelectedDates((prev) => ({
                                            ...prev,

                                            [expertId]: dateKey,
                                        }));

                                        setSelectedTimes((prev) => ({
                                            ...prev,

                                            [expertId]: "",
                                        }));
                                    }
                                }
                                className={`
                                    h-10
                                    rounded-lg
                                    text-sm
                                    font-semibold
                                    transition
                                    ${isSelected
                                        ? "bg-black text-white shadow-md"
                                        : "bg-white text-gray-800 hover:bg-black hover:text-white"}
                                    ${isDisabled
                                        ? "cursor-not-allowed bg-gray-100 text-gray-300 hover:bg-gray-100 hover:text-gray-300"
                                        : ""}
                                `}
                                title={
                                    isBooked
                                        ? "Already booked"
                                        : dateKey
                                }
                            >
                                {day.getDate()}
                            </button>
                        );
                    })}
                </div>

                <div className="
                    mt-4
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">
                    <p className="
                        text-sm
                        font-semibold
                        text-gray-700
                    ">
                        {selectedDate
                            ? `Selected: ${dateFormatter.format(new Date(`${selectedDate}T00:00:00`))}`
                            : "Select a date from the calendar"}
                    </p>
                </div>

                <div className="
                    mt-4
                    rounded-lg
                    bg-white
                    p-3
                    shadow-sm
                ">
                    <label
                        htmlFor={`duration-${expertId}`}
                        className="
                            text-xs
                            font-bold
                            uppercase
                            text-gray-500
                        "
                    >
                        Number of hours
                    </label>

                    <select
                        id={`duration-${expertId}`}
                        value={selectedDuration}
                        onChange={(event) => {
                            setSelectedDurations((prev) => ({
                                ...prev,

                                [expertId]: Number(event.target.value),
                            }));

                            setSelectedTimes((prev) => ({
                                ...prev,

                                [expertId]: "",
                            }));
                        }}
                        className="
                            mt-2
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-3
                            py-2
                            font-semibold
                            text-gray-800
                            outline-none
                            focus:border-black
                        "
                    >
                        {durationOptions.map((hours) => (
                            <option
                                key={hours}
                                value={hours}
                            >
                                {hours} {hours === 1 ? "hour" : "hours"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-2
                    sm:grid-cols-3
                ">
                    {timeOptions.map((time) => {
                        const isTimeDisabled =
                            !selectedDate ||
                            hasTimeConflict(
                                expertBookedSlots,
                                selectedDate,
                                time,
                                selectedDuration
                            );
                        const isTimeSelected =
                            selectedTime === time;

                        return (
                            <button
                                key={time}
                                type="button"
                                disabled={isTimeDisabled}
                                onClick={() =>
                                    setSelectedTimes((prev) => ({
                                        ...prev,

                                        [expertId]: time,
                                    }))
                                }
                                className={`
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    font-bold
                                    transition
                                    ${isTimeSelected
                                        ? "bg-black text-white"
                                        : "bg-white text-gray-800 hover:bg-black hover:text-white"}
                                    ${isTimeDisabled
                                        ? "cursor-not-allowed bg-gray-100 text-gray-300 hover:bg-gray-100 hover:text-gray-300"
                                        : ""}
                                `}
                                title={
                                    isTimeDisabled && selectedDate
                                        ? "This time overlaps another booking"
                                        : time
                                }
                            >
                                {formatTime(time)}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() =>
                        handleBookAppointment(
                            expertId,
                            selectedDate,
                            {
                                appointmentTime: selectedTime,
                                durationHours: selectedDuration,
                            }
                        )
                    }
                    className="
                        mt-4
                        w-full
                        rounded-lg
                        bg-red-500
                        px-4
                        py-2
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-red-600
                        disabled:cursor-not-allowed
                        disabled:bg-gray-300
                    "
                >
                    Book Custom Time
                </button>
            </div>
        );
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

                            {slots[expert._id] &&
                                renderCalendar(expert)}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Home;
