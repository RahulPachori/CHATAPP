# 💬 Real-Time Chat Application

A full-stack real-time chat application built with the **MERN stack**, featuring secure authentication, real-time messaging, online status, profile management, and image uploads.

## 🚀 Live Demo

**Frontend:** [https://chatapp-beta-virid.vercel.app/](https://chatapp-beta-virid.vercel.app/)

> The frontend is deployed on **Vercel** and communicates with the deployed backend through REST APIs and Socket.IO.

---

## ✨ Features

* 🔐 User Signup, Login & Logout
* 🔑 JWT authentication with HTTP-only cookies
* 🔒 Password hashing using bcrypt
* 💬 Real-time one-to-one messaging
* 🟢 Online/offline user status
* 🗄️ Persistent chat history with MongoDB
* 👤 Profile management
* 🖼️ Image uploads using Cloudinary
* 🎨 Multiple UI themes using DaisyUI
* ⚡ Global state management with Zustand
* 📱 Responsive UI

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* DaisyUI
* Zustand
* Axios
* Socket.IO Client
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT
* bcrypt
* Cloudinary

---

## 🏗️ Architecture

```text
                    React Frontend
                          │
                 ┌────────┴────────┐
                 │                 │
               Axios           Socket.IO
                 │                 │
                 ▼                 ▼
           Express Backend ←→ Socket Server
                 │
          ┌──────┴──────┐
          │             │
      Controllers    Middleware
          │
          ▼
       Mongoose
          │
          ▼
       MongoDB

          │
          └────── Cloudinary
                  (Images)
```

---

## 🔄 How It Works

### Authentication

```text
Login / Signup
      ↓
Express API
      ↓
bcrypt password verification
      ↓
JWT generated
      ↓
HTTP-only Cookie
      ↓
Protected requests verified by middleware
```

When the application loads, `checkAuth` verifies the existing JWT and restores the logged-in user.

### Real-Time Messaging

```text
User A
  ↓
MessageInput
  ↓
Zustand chatStore
  ↓
Axios → Backend
  ↓
Save message → MongoDB
  ↓
Socket.IO → User B
  ↓
Zustand updates messages
  ↓
React UI updates
```

**MongoDB** provides persistent message history, while **Socket.IO** provides real-time delivery.

### Image Upload

```text
React
  ↓
FormData
  ↓
Backend
  ↓
Cloudinary
  ↓
Image URL
  ↓
MongoDB
```

Only the Cloudinary URL is stored in MongoDB.

---

## 📁 Project Structure

```text
project/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/
│       │   ├── authStore.js
│       │   └── chatStore.js
│       ├── lib/
│       ├── App.jsx
│       └── main.jsx
│
└── backend/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── lib/
    ├── utils/
    └── index.js
```

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint                   | Purpose              |
| ------ | -------------------------- | -------------------- |
| POST   | `/api/auth/signup`         | Register user        |
| POST   | `/api/auth/login`          | Login                |
| POST   | `/api/auth/logout`         | Logout               |
| GET    | `/api/auth/check`          | Check authentication |
| PUT    | `/api/auth/update-profile` | Update profile       |

### Messages

| Method | Endpoint                 | Purpose          |
| ------ | ------------------------ | ---------------- |
| GET    | `/api/messages/users`    | Get users        |
| GET    | `/api/messages/:id`      | Get conversation |
| POST   | `/api/messages/send/:id` | Send message     |

---

## ⚙️ Environment Variables

### Backend

Create:

```text
backend/.env
```

```env
PORT=5001

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CLIENT_URL=http://localhost:5173
```

### Frontend

Create:

```text
frontend/.env
```

If your frontend uses Vite environment variables:

```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

For production, replace these with your deployed backend URLs.

> **Important:** Use the exact environment variable names expected by your source code.

> Never commit `.env` files or API keys to GitHub.

---

## 🧑‍💻 Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Configure `backend/.env`.

### 3. Start the backend

```bash
npm run dev
```

### 4. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Configure `frontend/.env`.

### 5. Start the frontend

```bash
npm run dev
```

Open the URL provided by Vite.

---

## 🔐 Security

* Passwords are hashed using **bcrypt**
* JWT is stored in an **HTTP-only cookie**
* Protected APIs use JWT middleware
* Secrets are stored in environment variables
* CORS is configured for frontend-backend communication

> This project uses bcrypt for password **hashing**. It does not implement end-to-end encryption for chat messages.

---

## 📌 Important

For the application to work correctly, you need:

* A MongoDB database
* A Cloudinary account for image uploads
* Correct frontend and backend environment variables
* Backend running before using the frontend locally
* Proper CORS configuration between the deployed frontend and backend

### Production

The frontend is deployed on **Vercel** and communicates with the deployed Node.js backend through REST APIs and Socket.IO.

**Live Application:**
[https://chatapp-beta-virid.vercel.app/](https://chatapp-beta-virid.vercel.app/)
