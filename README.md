# Study Dashboard Full-Stack

A unified full-stack application for managing study schedules, tasks, and notes. Built with Next.js, Node.js, Express, and MongoDB.

## Project Structure

- `frontend/`: Next.js frontend application (React, Tailwind CSS).
- `backend/`: Node.js Express API (MongoDB, JWT Authentication).
- Root: Registry and scripts to run both projects concurrently.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or on MongoDB Atlas)

### Setup

1. **Clone the repository** (if not already done).
2. **Install dependencies** in the root directory:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Match your settings in `backend/.env` (or copy from `.env.example` in the root).
   ```bash
   # Root .env.example
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

To run both the frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000`

### Available Scripts

- `npm run dev`: Starts both frontend and backend in development mode.
- `npm run frontend`: Starts only the frontend.
- `npm run backend`: Starts only the backend.

## Features

- **Authentication**: Secure Signup and Login using JWT.
- **Subjects**: Create and manage study subjects with custom colors.
- **Tasks**: Track tasks with priorities and due dates.
- **Notes**: Rich note-taking for each subject.
- **Persistence**: All data is saved to MongoDB.

# Deployment Update: Tue Feb 10 12:36:28 IST 2026
