# Smart Bus Tracking Web Application

A full-stack real-time bus tracking system built with the MERN stack (MongoDB, Express, React, Node) and Socket.IO.

## Features
- **Real-time Tracking**: Visualize bus locations live on a map.
- **Admin Dashboard**: Manage buses, drivers, and complaints.
- **Search & Filter**: Find buses by number or route.
- **Complaints**: Users can report issues directly from the tracking page.
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Leaflet, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO, Mongoose (MongoDB)
- **Security**: JWT Authentication, API Key for IoT devices.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/smart-bus-tracker
# JWT_SECRET=secret
# DEVICE_API_KEY=esp32-secure-key
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### Device API (ESP32)
**POST** `/api/device/location`
Headers: `x-api-key: esp32-secure-key`
Payload:
```json
{
  "busNumber": "DL-01-1234",
  "lat": 28.6139,
  "lng": 77.2090,
  "speed": 45
}
```

### User APIs
- `GET /api/bus`: List all active buses
- `GET /api/bus/:id`: Get bus details
- `POST /api/auth/login`: User login

## Admin Credential
Create an admin user manually in MongoDB or via registration API (if enabled). 
Role must be set to `admin`.

## Project Structure
- `backend/`: Server and API logic
- `frontend/`: React UI application
- `frontend/src/pages/`: Main views (Home, TrackBus, AdminDashboard, Login)

## Troubleshooting

### Frontend
- **Vite Error**: If you see `Failed to parse source...`, ensure `AuthContext.jsx` has the `.jsx` extension.

### Backend
- **MongoDB Connection Error**: `ECONNREFUSED` means MongoDB is not running locally.
  - Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community).
  - Or use a cloud URI in `backend/.env`.
