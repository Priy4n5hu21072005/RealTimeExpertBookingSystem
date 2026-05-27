# Expert Booking System

A web application built using the MERN stack (MongoDB, Express, React, and Node) that allows users to find experts, check their availability, and book appointments.

---

## Folder Structure

Here is a quick overview of how the codebase is organized:

```text
ExpertBookingSystem/
├── Backend/
│   ├── config/             # Database connection settings (MongoDB)
│   ├── controllers/        # Request handling logic (authentication, experts, bookings)
│   ├── middleware/         # Authentication guard (JWT verification)
│   ├── models/             # Mongoose schemas (User, ExpertProfile, Appointment)
│   ├── routes/             # Express API routes
│   ├── .env.example        # Environment variables template
│   └── server.js           # Express app entry point
└── frontend/
    ├── src/
    │   ├── components/     # Shared components (like the Navbar)
    │   ├── pages/          # Application views (Home, Login, Register, Profile creation)
    │   ├── services/       # API call handlers (Axios client setup)
    │   ├── App.jsx         # Routes definition
    │   └── main.jsx        # React application entry point
    ├── index.html
    └── vite.config.js
```

---

## Key Features

1. **User Authentication**: Register and login as either a **Customer** or an **Expert**. JWTs are stored in local storage for session management.
2. **Expert Discovery**: View and search experts by name, expertise, or specific skills.
3. **Availability Management**: The system dynamically scans existing bookings and lists the next 3 available days for an expert.
4. **Appointment Booking**: Logged-in customers can reserve one of the available dates with their chosen expert.

---

## Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) and a running [MongoDB](https://www.mongodb.com/) instance (local or Atlas) installed on your machine.

---

### Step 1: Set up the Backend

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory:
   ```bash
   cp .env.example .env
   ```
4. Open the `.env` file and configure your port, MongoDB Connection URI, and JWT Secret:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   ```
5. Start the backend server:
   - For production:
     ```bash
     npm start
     ```
   - For development (runs with nodemon auto-restart):
     ```bash
     npm run dev
     ```

The API will now be running on `http://localhost:5000`.

---

### Step 2: Set up the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend will run by default on `http://localhost:5173`. Open this URL in your web browser.

---

## API Endpoints

### Authentication
* `POST /api/auth/register` - Create a new user account.
* `POST /api/auth/login` - Login to get a JWT token.

### Experts
* `GET /api/experts` - Retrieve all experts (supports search using query parameters: `?keyword=react`).
* `POST /api/experts` - Create an expert profile (requires authentication).

### Appointments
* `GET /api/appointments/slots/:expertId` - Fetch the next 3 available calendar days for an expert.
* `POST /api/appointments` - Book an appointment slot (requires authentication).
