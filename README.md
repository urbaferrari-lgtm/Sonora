# Sonora

Sonora is a Spotify-inspired music app with a React frontend and an Express backend. It supports listening to music, browsing albums, creating an artist studio, and uploading music tracks.

## Features

- User authentication and role-based access
- Music catalog browsing and track playback
- Artist studio for uploading audio tracks
- Album collection and dashboard views
- Secure API with JWT-based auth
- CORS-enabled frontend/backend communication

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB with Mongoose
- Authentication: JWT + bcryptjs
- File uploads: Multer

## Project Structure

```text
spotify/
├── backend/
│   ├── src/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md
└── package-lock.json
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or via MongoDB Atlas
- npm

## Backend Setup

1. Open a terminal in the backend folder:

```bash
cd backend
npm install
```

2. Create a `.env` file in the backend folder with the following values:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/sonora
JWT_SECRET=your_super_secret_key
FRONTEND_URLS=http://localhost:5173
```

3. Start the server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`.

## Frontend Setup

1. Open a terminal in the frontend folder:

```bash
cd frontend
npm install
```

2. Start the Vite app:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

## Environment Notes

If the frontend needs to connect to a different backend URL, set the following in the frontend environment:

```env
VITE_API_URL=http://localhost:3000/api
```

## Default App Flow

- Register or log in as a user or artist
- Browse the music dashboard and albums
- Artists can upload audio files from the studio page
- Listen to preview tracks in the app player

## Scripts

Backend:

```bash
npm run dev
npm start
npm test
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## Notes

This project is meant as a learning/demo application and is designed around a Spotify-inspired interface and core music catalog features. Depending on your deployment setup, you may want to add a proper cloud storage solution for uploaded audio files and secure environment management for production.
