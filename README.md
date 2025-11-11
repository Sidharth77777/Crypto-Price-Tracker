# 🔥 WatchMyCrypto — Real-Time Crypto Price Tracker & Alerts

A modern cryptocurrency price monitoring dashboard built using **Next.js**, **TypeScript**, **Express**, and **MongoDB** — with real-time price tracking, watchlists, and automatic price alert notifications.

Stay updated on your favorite coins — anytime, anywhere 🚀

[Live Link](https://watch-my-crypto.vercel.app/)

---

## 🧠 Features

### 🌍 Live Crypto Tracking
- Real-time pricing powered by **CoinGecko API**
- Global cryptocurrency list synced automatically

### ⭐ Watchlist Support
- Track only the coins you care about
- Personalized dashboard synced to your account

### 🚨 Price Alerts
- Notify users via email when price thresholds are triggered
- Background job execution using **cron-job.org**

### 🔐 Secure Auth System
- Email + Password Login
- **JWT-based authentication**
- Password reset with **OTP verification**

### 🎨 Modern UI / UX
- Built using:
  - **TypeScript**
  - **Next.js (App Router)**
  - **TailwindCSS**
  - **shadcn/ui**
  - **Framer Motion**
- Fully responsive and dark mode ready

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend Framework | Next.js (TypeScript + App Router) |
| UI & Styling | TailwindCSS, shadcn/ui, Framer Motion |
| Backend API | Node.js + Express (TypeScript) |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + Secure HttpOnly Token Flow |
| Background Jobs | cron-job.org (minute + daily triggers) |
| Email / OTP | Nodemailer |
| Icons | Lucide-React + react-icons |
| Notifications | react-hot-toast |
| Deployment | Vercel |

---

## 🔁 Architecture Overview

Frontend (Next.js) — deployed on Vercel
|
| Secure Server-to-Server Authorization
v
Backend (Express API) — deployed on Render
|
v
MongoDB (Atlas / Cloud)

---


### Cron Scheduling
| Job | Schedule | Runs Where |
|-----|----------|-----------|
| Coin List Refresh | Daily @ 00:00 UTC | Scheduled via cron-job.org → Frontend API|
| Price Alert Scanner | Every 1 minute | Scheduled via cron-job.org → Frontend API |

---

## 📸 Preview

![Get Started](https://drive.usercontent.google.com/download?id=1BXsbt-vKRDCq6D3IjwxdyqK-_aitN40L&export=view&authuser=0)

**Dashboard**
> Clean, minimal, realtime pricing UI

**Watchlist**
> Track your selected assets

**Alert Manager**
> Set triggers and get notified instantly

*(screenshots placeholders — add when ready)*

---

## ⚙️ Setup Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Sidharth77777/Watch-My-Crypto.git
cd WatchMyCrypto
```

### 2️⃣ Install Dependencies

#### Client
```bash
cd client
npm install
```

#### Server
```bash
cd server
npm install
```

### 3️⃣ Create Environment Variables
Provide your environment variables

#### Client (client/.env)
```bash
NEXT_PUBLIC_SERVER_URL=
CRON_SECRET=
```

#### Server (server/.env)
```bash
PORT=
FRONTEND_ORIGIN=
MONGODB_URI=
JWT_SECRET=
SMTP_PASSWORD=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
COINGECKO_SECRET_KEY=
CRON_SECRET=
ENABLE_SELF_CRON=false
```

### 4️⃣ Development

#### Start Server
```bash
cd server
npm run dev
```

### Start Frontend
```bash
cd client
npm run dev
```

---

## 🔗 Deployment Instructions

| Component | Host             | Notes                                   |
| --------- | ---------------- | --------------------------------------- |
| Frontend  | **Vercel**       | Just connect repo → build automatically |
| Backend   | **Render**       | Use `npm run build && npm start`        |
| Cron Jobs | **cron-job.org** | Calls `/api/cron/*` every minute/daily  |

---

## 🧾 API Reference (Minimal)

| Method                              | Route                    | 
| ----------------------------------- | ------------------------ | 
| `POST /api/auth/register`           | Register user            |
| `POST /api/auth/login`              | Login + get JWT token    |
| `GET /api/coins/getAll`             | Get All User coin list   |
| `POST /api/coins/create-alert`      | Create new price alert   | 
| `DELETE /api/coins/delete-alert`    | Delete a price alert     | 
| `POST /api/cron/`                   | Scheduled cron jobs      | 

---

## 👨‍💻 Author
### Sidharth K S
| Platform    | Link                                                                 |
| ----------- | -------------------------------------------------------------------- |
| GitHub      | [https://github.com/Sidharth77777](https://github.com/Sidharth77777) |
| X (Twitter) | [https://x.com/cryptoSid1564](https://x.com/cryptoSid1564)           |


