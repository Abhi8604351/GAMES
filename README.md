# FunZone-MEAN 🎮

A production-ready Gaming Web Platform built with the MEAN Stack (MongoDB, Express, Angular 17, Node.js).

## 🚀 Features

- **Auth System**: JWT-based login/register with role-based access (Admin/User).
- **10 Games**: Fully playable games including Tic Tac Toe, Snake, Brick Breaker, 2048, etc.
- **Admin Panel**: Manage users and view global leaderboards.
- **User Dashboard**: Track personal high scores and game history.
- **Premium UI**: Dark gaming theme with neon accents and smooth animations.

## 🛠 Tech Stack

- **Frontend**: Angular 17 (Standalone Components, SCSS, Signals)
- **Backend**: Node.js v20, Express
- **Database**: MongoDB (Atlas compatible)
- **Styling**: Vanilla SCSS + Bootstrap Icons

## 📦 Project Structure

```text
FunZone-MEAN/
├── backend/            # Express Server
│   ├── config/         # DB Connection
│   ├── controllers/    # API Logics
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Endpoints
│   └── middlewares/    # JWT & Error Handling
├── frontend/           # Angular 17 App
│   ├── src/app/
│   │   ├── core/       # Services & Guards
│   │   ├── shared/     # Layouts & Components
│   │   ├── auth/       # Login/Register
│   │   ├── user/       # Dashboard & Games
│   │   └── admin/      # Admin Panel
└── README.md
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js v20+
- MongoDB (Local or Atlas)

### 2. Backend Setup
1. Navigate to `/backend`
2. Run `npm install`
3. Create a `.env` file (see `.env.example`)
4. Run `npm start` (Runs on port 5000)

### 3. Frontend Setup
1. Navigate to `/frontend`
2. Run `npm install`
3. Run `npm start` (Runs on port 4200)

## 🌐 Deployment

### Backend (Render)
- Connect your GitHub repo.
- Build Command: `npm install`
- Start Command: `node server.js`
- Set environment variables on Render dashboard.

### Frontend (Vercel)
- Connect GitHub repo.
- Framework Preset: `Angular`
- Build Command: `ng build`
- Output Directory: `dist/frontend/browser`

## 🎮 Game List
1. Tic Tac Toe
2. Snake Game
3. Brick Breaker
4. Rock Paper Scissors
5. Memory Card Game
6. Number Guessing Game
7. Hangman
8. 2048 Game
9. Connect Four
10. Reaction Timer Game

---
Built with ❤️ by Antigravity
