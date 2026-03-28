# Hike - Real-Time Chat Application

Hike is a full-stack, real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. It features secure user authentication, real-time messaging, online status tracking, profile management with image uploads (Cloudinary), and highly customizable UI themes.

## Features

- **Real-Time Communication**: Instant messaging and live online presence tracking powered by Socket.io.
- **User Authentication**: Secure signup and login flow leveraging JWT (JSON Web Tokens) and bcrypt.
- **Profile Management**: Users can update their profile pictures, securely stored and served via Cloudinary.
- **Customizable Themes**: Supports dynamic theme switching (30+ themes including Light, Dark, Cupcake, Retro, Cyberpunk) using DaisyUI.
- **State Management**: Clean and efficient global state management using Zustand.
- **Responsive UI**: Modern, responsive design built from the ground up with TailwindCSS.

## Tech Stack

### Frontend
- React 19 (Vite)
- React Router DOM
- TailwindCSS & DaisyUI
- Zustand (State Management)
- Socket.io-client
- Axios & React Hot Toast

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Socket.io (WebSockets)
- JSON Web Token (JWT) & bcryptjs
- Cloudinary

## Getting Started

### Prerequisites
- Node.js installed on your machine
- MongoDB cluster URI
- Cloudinary account and API credentials

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Hike_Chat_App
   ```

2. **Install Dependencies:**
   You can install both frontend and backend dependencies by running the build script from the root directory:
   ```bash
   npm run build
   ```
   *(Alternatively, run `npm install` inside both `/frontend` and `/backend` directories)*

3. **Environment Setup:**
   Create a `.env` file in the `/backend` directory and configure the following variables:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the Application locally:**

   Start the **Backend server**:
   ```bash
   cd backend
   npm run dev
   ```

   Start the **Frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```

## License
ISC
