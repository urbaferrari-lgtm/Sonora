🎵 Sonora

Sonora is a Spotify-inspired music streaming application built with React, Node.js, Express, and MongoDB.

The application allows users to discover and listen to music, browse albums, manage their profiles, and provides artists with a dedicated studio for uploading and managing audio tracks.

🚧 Project Status: Learning / Demo Project

✨ Features
🎧 Music & Catalog

Browse available music tracks and albums

Preview and play audio directly in the application

Explore album collections

Dashboard views for music discovery

👤 Authentication & Roles

User registration and login

JWT-based authentication

Password hashing with bcryptjs

Role-based access for users and artists

Protected API routes

🎤 Artist Studio

Dedicated artist dashboard

Upload audio tracks

Manage artist content

Multer-based file upload handling

🔐 Backend & Security

RESTful API built with Express

JWT authentication

CORS-enabled frontend/backend communication

Environment-based configuration

MongoDB database with Mongoose

🛠️ Tech Stack
Layer	Technology
Frontend	React + Vite
Backend	Node.js + Express
Database	MongoDB + Mongoose
Authentication	JWT + bcryptjs
File Uploads	Multer
API	REST API
Development	npm
📁 Project Structure
sonora/
├── backend/
│   ├── src/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── package-lock.json

📋 Prerequisites

Before running Sonora locally, make sure you have:

Node.js 18+

npm

MongoDB

Local MongoDB installation, or

A MongoDB Atlas cluster

🚀 Getting Started

Follow the steps below to run Sonora locally.

1. Clone the Repository
git clone <your-repository-url>
cd sonora

⚙️ Backend Setup

Navigate to the backend directory:

cd backend


Install dependencies:

npm install

Configure Environment Variables

Create a .env file inside the backend directory:

PORT=3000
MONGO_URI=mongodb://localhost:27017/sonora
JWT_SECRET=your_super_secret_key
FRONTEND_URLS=http://localhost:5173


Important: Never commit your .env file or expose your JWT secret publicly.

Start the Backend

For development:

npm run dev


For production:

npm start


The backend API will be available at:

http://localhost:3000

💻 Frontend Setup

Open a new terminal and navigate to the frontend:

cd frontend


Install dependencies:

npm install

Configure API URL

If required, create a .env file inside the frontend directory:

VITE_API_URL=http://localhost:3000/api


If you're using the default local backend configuration, this will point the frontend to:

http://localhost:3000/api

Start the Frontend
npm run dev


The frontend will be available at:

http://localhost:5173

🔄 Application Flow

A typical Sonora user journey looks like this:

Register / Login
       ↓
Music Dashboard
       ↓
Browse Albums & Tracks
       ↓
Play Music


For artists:

Register / Login as Artist
       ↓
Artist Studio
       ↓
Upload Audio Track
       ↓
Track Added to Catalog
       ↓
Users Can Preview / Play Track

📜 Available Scripts
Backend
Command	Description
npm run dev	Start the backend in development mode
npm start	Start the backend
npm test	Run backend tests
Frontend
Command	Description
npm run dev	Start Vite development server
npm run build	Create a production build
npm run preview	Preview the production build locally
🔑 Environment Variables
Backend
Variable	Description	Example
PORT	Backend server port	3000
MONGO_URI	MongoDB connection string	mongodb://localhost:27017/sonora
JWT_SECRET	Secret used to sign JWTs	your_super_secret_key
FRONTEND_URLS	Allowed frontend origin(s)	http://localhost:5173
Frontend
Variable	Description	Example
VITE_API_URL	Backend API base URL	http://localhost:3000/api
🗄️ Database

Sonora uses MongoDB with Mongoose for data persistence.

You can use either:

A local MongoDB instance

MongoDB Atlas

For local development, the default database is:

mongodb://localhost:27017/sonora

🔒 Security Notes

For production deployments, consider adding:

Strong, randomly generated JWT secrets

Secure environment variable management

HTTPS

File type and file size validation

Cloud storage for uploaded audio

Rate limiting

Additional API validation

Secure cookie-based authentication where appropriate

Proper production CORS configuration

☁️ Production Considerations

Sonora currently uses local file handling for uploaded audio. For a production application, it is recommended to move uploaded media to a dedicated cloud storage service.

Possible options include:

Amazon S3

Cloudinary

Google Cloud Storage

Firebase Storage

You may also want to introduce a CDN for faster audio delivery.

🎯 Future Improvements

Some potential improvements for the project:

 Playlist creation and management

 Like / favorite tracks

 Search functionality

 Artist profiles

 Album creation and management

 Music queue

 Recently played tracks

 Audio progress and volume controls

 Cloud-based audio storage

 Admin dashboard

 Improved upload validation

 Automated testing

 Production deployment configuration

🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

Fork the repository

Create a new branch

git checkout -b feature/your-feature


Make your changes

Commit your changes

git commit -m "Add your feature"


Push the branch

git push origin feature/your-feature


Open a Pull Request

📄 License

This project is intended for learning and demonstration purposes.

If you plan to use Sonora commercially, add an appropriate open-source license and review the licensing requirements for any music, artwork, libraries, or third-party services used by the application.

🎵 About Sonora

Sonora is designed as a learning project inspired by modern music streaming platforms. It demonstrates how a full-stack application can combine:

React → Express → MongoDB → Authentication → File Uploads → Music Playback

The project can be extended into a more complete music platform by adding playlists, search, recommendations, cloud storage, artist management, and additional production-grade security features.
