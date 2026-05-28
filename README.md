# Expert Booking System

A MERN stack web application that allows customers to find experts, check availability, and book appointments with quick dates or custom calendar date/time slots.

---

## Folder Structure

```text
ExpertBookingSystem/
|-- Backend/
|   |-- config/             # Database connection settings
|   |-- controllers/        # Request handling logic
|   |-- middleware/         # JWT authentication guard
|   |-- models/             # Mongoose schemas
|   |-- routes/             # Express API routes
|   `-- server.js           # Express app entry point
`-- frontend/
    |-- src/
    |   |-- components/     # Shared UI components
    |   |-- pages/          # Home, Login, Register, Appointments, Profile pages
    |   |-- services/       # Axios API setup
    |   |-- App.jsx         # Route definitions
    |   `-- main.jsx        # React entry point
    |-- index.html
    `-- vite.config.js
```

---

## Key Features

1. **User Authentication**: Register and login as a customer or expert.
2. **Expert Discovery**: View and search experts by name, expertise, or skills.
3. **Quick Availability**: Show the next 3 available dates for an expert.
4. **Calendar Booking**: Choose a custom future date from a calendar UI.
5. **Custom Time Selection**: Select the number of hours first, then choose a start time.
6. **Overlap Prevention**: The backend blocks overlapping bookings for the same expert.
7. **My Appointments**: Customers can view booked appointments with date, time, duration, expert, and status.

---

## Setup & Installation

### Prerequisites

Install [Node.js](https://nodejs.org/) and use a running MongoDB instance, either local MongoDB or MongoDB Atlas.

### Backend

1. Navigate to the backend directory:

   ```bash
   cd Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `Backend` directory and configure it:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

   For development with auto-restart:

   ```bash
   npm run dev
   ```

The API runs on `http://localhost:5000`.

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

The frontend runs on `http://localhost:5173`.

---

## API Endpoints

### Authentication

* `POST /api/auth/register` - Create a new user account.
* `POST /api/auth/login` - Login and receive a JWT token.

### Experts

* `GET /api/experts` - Retrieve all experts.
* `POST /api/experts` - Create an expert profile. Requires authentication.

### Appointments

* `GET /api/appointments/slots/:expertId` - Fetch the next 3 available dates, booked dates, and booked time slots for an expert.
* `POST /api/appointments` - Book an appointment. Requires authentication.
* `GET /api/appointments/my` - Fetch the logged-in customer's appointments.

Date-only booking request:

```json
{
  "expertId": "expert_profile_id",
  "appointmentDate": "2026-06-01"
}
```

Custom date and time booking request:

```json
{
  "expertId": "expert_profile_id",
  "appointmentDate": "2026-06-01",
  "appointmentTime": "10:00",
  "durationHours": 2
}
```

`appointmentTime` uses 24-hour `HH:mm` format. `durationHours` supports values from 1 to 8.

---

## Booking Flow

1. Customer logs in.
2. Customer opens the experts list.
3. Customer clicks **Show Available Slots** for an expert.
4. Customer either chooses a quick available date or uses the calendar.
5. For custom booking, customer selects a date, number of hours, and start time.
6. Backend checks for conflicting appointments before saving the booking.
7. Customer can view the booking from **My Appointments**.

---

## Useful Commands

Run frontend build:

```bash
cd frontend
npm run build
```

Run backend:

```bash
cd Backend
npm start
```
