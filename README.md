<div align="center">

# 💬 NexTalk

**The Next Conversation — a real-time, end-to-end encrypted chat app**

Built with the MERN stack, Socket.IO, Google Sign-In and email OTP verification.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

<p align="center">
  <a href="https://chatapp-beta-virid.vercel.app"><b>🚀 Live Demo</b></a>
</p>

---

## 📑 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [How Authentication Works](#-how-authentication-works)
- [How Encryption Works](#-how-end-to-end-encryption-works)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Setting Up Email OTP (Brevo)](#-setting-up-email-otp-brevo)
- [Setting Up Google Sign-In](#-setting-up-google-sign-in)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Security Notes](#-security-notes)

---

## 🌐 Live Demo

| | Link |
|---|------|
| **App (frontend)** | https://chatapp-beta-virid.vercel.app |
| **API (backend)** | https://nextalk-backend-qgg4.onrender.com |

> ⏳ The backend runs on a free Render plan, so the **first request after a period of inactivity can take up to a minute** while the server wakes up. Please be patient on the first load.

**Try it:** open the app, sign up with your email (you will receive a 6-digit code) or use **Sign up with Google**, then chat with another account in a second browser or a private window.

---

## ✨ Features

- 💬 **Real-time messaging** with Socket.IO and live online status
- 🔒 **End-to-end encryption**: the server and database only ever see scrambled text
- 🔑 **Two ways to sign up**
  - Email and password, verified by a **6-digit OTP** sent to the inbox (only real emails can register)
  - **Google Sign-In**, followed by choosing a **username** and **password**
- 🖼️ **Image sharing** and profile pictures stored on Cloudinary
- 😀 **Emoji picker** in the message box
- 🎨 **Multiple themes** with a settings page
- 👤 **Profile page** to update your photo and view your account details
- 📱 **Responsive layout** for desktop and mobile
- 🍪 **Secure sessions** with JWT stored in HTTP-only cookies

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, Tailwind CSS 4, Zustand, React Router 7, Axios, Socket.IO Client, React Hot Toast, Lucide Icons, Emoji Picker React |
| **Backend** | Node.js, Express 5, Mongoose, Socket.IO, JSON Web Tokens, bcryptjs, Multer |
| **Database** | MongoDB (Atlas or local) |
| **Media storage** | Cloudinary |
| **Email (OTP)** | Nodemailer over SMTP, using **Brevo** (port 2525) in production |
| **Social login** | Google Identity Services + `google-auth-library` |
| **Encryption** | Browser Web Crypto API (RSA-OAEP + AES-GCM) |

---

## 🔐 How Authentication Works

### Email signup (with OTP)

```
User enters name, email, password
        │
        ▼
Clicks "Send Code"  ──►  POST /api/auth/send-otp
        │                  • checks email format and that it is not registered
        │                  • generates a 6-digit code (crypto.randomInt)
        │                  • stores only a bcrypt hash of it (expires in 10 min)
        │                  • emails the code with Nodemailer
        ▼
User types the code  ──►  POST /api/auth/signup
                           • verifies the code (max 5 attempts)
                           • creates the account and logs the user in
```

- A new code can be requested only once every **60 seconds**.
- Codes are deleted automatically by a MongoDB TTL index after they expire.

### Google signup

1. The user clicks **Sign up with Google**.
2. The backend verifies the Google token and creates the account.
3. On the **first login only**, the app asks for a **username** and **password**.
   - Username: 3–20 characters, letters, numbers or underscore, and unique.
   - The password locks the user's encryption key (see below).
4. On later logins the user signs in directly. On a new device the app asks only for the password.

---

## 🛡️ How End-to-End Encryption Works

NexTalk uses the browser's built-in **Web Crypto API**, with no extra packages.

1. Every user has an **RSA key pair**.
   - The **public key** is stored on the server.
   - The **private key** is locked with the user's password. Only that locked copy is stored on the server, so login works on any device.
2. Each message is encrypted with a random **AES key**.
3. That AES key is encrypted with both the **receiver's** and the **sender's** public key, so both people can read the conversation.
4. The server and database store only ciphertext.

> ⚠️ Because the private key is locked with the user's password, **a forgotten password means old messages cannot be read**.

---

## 📁 Project Structure

```
CHATAPP/
├── backend/
│   ├── package.json
│   └── src/
│       ├── index.js                 # Express app entry point
│       ├── controllers/
│       │   ├── auth.controller.js   # signup, login, OTP, Google, keys
│       │   └── message.controller.js
│       ├── lib/
│       │   ├── db.js                # MongoDB connection
│       │   ├── socket.js            # Socket.IO server
│       │   ├── cloudinary.js        # Cloudinary config
│       │   ├── mailer.js            # Nodemailer (sends OTP emails)
│       │   └── utils.js             # JWT cookie helper
│       ├── middleware/
│       │   ├── auth.middleware.js   # protectRoute
│       │   └── upload.middleware.js # Multer
│       ├── models/
│       │   ├── user.model.js
│       │   ├── message.model.js
│       │   └── otp.model.js
│       └── routes/
│           ├── auth.route.js
│           └── message.route.js
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── vercel.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── Pages/                   # Home, Login, SignUp, Profile, Settings
        ├── Components/              # SideBar, ChatContainer, MessageInput,
        │                            # GoogleAuthButton, NavBar ...
        ├── store/                   # Zustand: auth, chat, theme
        └── lib/                     # axios.js, crypto.js, utils.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local MongoDB)
- A [Cloudinary](https://cloudinary.com/) account
- A Google Cloud OAuth client ID (see [below](#-setting-up-google-sign-in))
- A free [Brevo](https://www.brevo.com/) account for sending OTP emails (see [below](#-setting-up-email-otp-brevo))

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/CHATAPP.git
cd CHATAPP
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env` (see [Environment Variables](#-environment-variables)), then start the server:

```bash
npm run dev      # development with nodemon
npm start        # production
```

The API runs on `http://localhost:5005`.

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5005
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Start the dev server:

```bash
npm run dev
```

Open **http://localhost:5173**.

---

## ⚙️ Environment Variables

### `backend/.env`

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5005`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign login tokens |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend URL for CORS, **no trailing slash** (e.g. `http://localhost:5173`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GOOGLE_CLIENT_ID` | Google OAuth Web client ID |
| `SMTP_HOST` | SMTP server: `smtp-relay.brevo.com` |
| `SMTP_PORT` | `2525` on Render (587, 465 and 25 are blocked there). `587` works on your own computer |
| `SMTP_USER` | Brevo **SMTP login**, e.g. `xxxxxx001@smtp-brevo.com` (not your email address) |
| `SMTP_PASS` | Brevo **SMTP key**, pasted without spaces or quotes |
| `SMTP_FROM` | A **verified Brevo sender**, e.g. `NexTalk <you@example.com>` |

Example:

```env
PORT=5005
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/
JWT_SECRET=replace-with-a-long-random-string
NODE_ENV=development
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=2525
SMTP_USER=xxxxxx001@smtp-brevo.com
SMTP_PASS=your-brevo-smtp-key
SMTP_FROM=NexTalk <you@example.com>
```

Generate a strong `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### `frontend/.env`

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Backend URL, **no trailing slash** |
| `VITE_GOOGLE_CLIENT_ID` | The same Google OAuth client ID |

---

## 📧 Setting Up Email OTP (Brevo)

NexTalk sends the signup code through Brevo's SMTP relay. Gmail SMTP is **not** recommended for the deployed app, because Render's free plan blocks the usual SMTP ports (25, 465 and 587), so connections time out.

1. **Create an account** at <https://www.brevo.com/> (the free plan is enough) and verify your email.
2. **Add a sender.** Open *Senders, Domains & Dedicated IPs → Senders → Add a sender*, enter a name and the address you want to send from, then click the verification link Brevo emails you.
3. **Get your SMTP login.** Click your account name (top right) → *SMTP & API* → *SMTP* tab. The **Login** shown there (`xxxxxx001@smtp-brevo.com`) is your `SMTP_USER`.
4. **Generate an SMTP key.** Click *Generate SMTP key*, name it `nextalk`, keep the **Standard** variant and the default expiry, then copy the key straight away. It is shown only once. This is your `SMTP_PASS`.
5. **Set the variables** in `backend/.env` (local) and in the Render dashboard (production):

   ```env
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=2525
   SMTP_USER=xxxxxx001@smtp-brevo.com
   SMTP_PASS=your-brevo-smtp-key
   SMTP_FROM=NexTalk <your-verified-sender>
   ```

6. **Restart or redeploy** the backend, because environment variables are only read at startup.

> ⚠️ Do **not** click *Activate for SMTP keys* (the unauthorized-IP blocking option) on Render's free plan. Render's outgoing IP addresses change, so Brevo would reject your emails.

> ℹ️ Brevo expires an SMTP key after 90 days of no use, and after its set expiry date (1 year by default). If OTP emails suddenly stop, generate a new key and update `SMTP_PASS`.

> 📬 If the email does not arrive, check the spam folder. *Transactional → Logs* in Brevo shows whether the message was sent or blocked. For best delivery in real use, send from a domain you own and authenticate it (SPF and DKIM) in Brevo.

---

## 🔑 Setting Up Google Sign-In

1. Go to the [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth client ID** of type **Web application**.
3. Under **Authorized JavaScript origins**, add every address the frontend runs on:
   - `http://localhost:5173`
   - `https://your-app.vercel.app` (your deployed URL, **no trailing slash**)
4. Copy the client ID into `GOOGLE_CLIENT_ID` (backend) and `VITE_GOOGLE_CLIENT_ID` (frontend).

Changes can take a few minutes to take effect.

---

## 📡 API Reference

Base URL: `/api`

### Auth: `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/send-otp` | – | Email a 6-digit verification code |
| `POST` | `/signup` | – | Create an account (needs `fullName`, `email`, `password`, `otp`) |
| `POST` | `/login` | – | Log in with email and password |
| `POST` | `/logout` | – | Clear the session cookie |
| `POST` | `/google` | – | Sign in or sign up with a Google token |
| `PUT` | `/set-password` | ✅ | First Google login: set `username` and `password` |
| `PUT` | `/keys` | ✅ | Save the user's encryption keys |
| `PUT` | `/update-profile` | ✅ | Upload a new profile picture |
| `GET` | `/check` | ✅ | Get the currently logged-in user |

### Messages: `/api/messages`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/users` | ✅ | List users for the sidebar |
| `GET` | `/:id` | ✅ | Get the conversation with a user |
| `POST` | `/send/:id` | ✅ | Send an encrypted message or image |

---

## ☁️ Deployment

The usual setup is **Vercel** for the frontend and **Render** for the backend.

### Backend (Render)

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Add all [backend environment variables](#-environment-variables) in the Render dashboard. For production make sure:

- `NODE_ENV=production`. This enables `secure` and `sameSite=none` cookies, which are required when the frontend and backend are on different domains.
- `CLIENT_URL` is your exact Vercel URL, without a trailing slash.
- `SMTP_PORT=2525` (with the Brevo values above). Ports 25, 465 and 587 are blocked on Render's free plan.

### Frontend (Vercel)

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Add `VITE_BACKEND_URL` and `VITE_GOOGLE_CLIENT_ID` under **Settings → Environment Variables**, then **redeploy**. Vite bakes these values into the build, so a redeploy is required after any change.

---

## 🩺 Troubleshooting

| Problem | Likely cause and fix |
|---------|----------------------|
| **"Could not send a code to this email"** | Read the `OTP mail error:` line in the Render logs. *Authentication failed*: `SMTP_USER` must be the Brevo SMTP login and `SMTP_PASS` the SMTP key. *Sender not valid*: `SMTP_FROM` must be a verified Brevo sender. *Timeout*: set `SMTP_PORT=2525` on Render. |
| **OTP email never arrives** | Check spam, then Brevo's *Transactional → Logs*. Make sure *Activate for SMTP keys* (IP blocking) is off and the key has not expired. |
| **"Send Code" hangs for a long time** | The SMTP port is blocked by the host. Use port `2525`. |
| **Google error `origin_mismatch`** | The frontend URL is missing from *Authorized JavaScript origins*, or `VITE_GOOGLE_CLIENT_ID` on Vercel is wrong. Redeploy after fixing it. |
| **`POST /api/auth/google` returns 404 on the deployed site** | The deployed backend is an older version. Push the latest backend code and redeploy. |
| **`GET /api/auth/check` returns 401** | Normal when you are not logged in. |
| **Login works locally but not when deployed** | Set `NODE_ENV=production` and the correct `CLIENT_URL` on the backend. |
| **First request after idle is very slow** | Free hosting tiers go to sleep. Wait up to a minute for the server to wake. |
| **Old messages show as unreadable** | The account password was reset, so the encryption key could not be unlocked. |

---

## 🔒 Security Notes

- **Never commit `.env` files.** The `.gitignore` already excludes them.
- Rotate any secret that has ever been shared publicly (MongoDB password, JWT secret, Cloudinary secret, Brevo SMTP key).
- OTP codes and passwords are stored only as **bcrypt hashes**.
- Sessions use **HTTP-only** cookies, so JavaScript in the browser cannot read the token.
- Messages are encrypted in the browser before they are sent.

---

<div align="center">

Made with ❤️ using React, Node.js and MongoDB

</div>
