# Expert Booking System Backend

Express and MongoDB backend for the Expert Booking System.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CORS_ORIGIN=*
```

3. Run the server:

```bash
npm run dev
```

## Render deployment

Use these settings on Render:

- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`

Add these environment variables in Render:

- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGIN` (use `*` during development, or your frontend URL in production)

Render provides `PORT` automatically, so do not hardcode it.
