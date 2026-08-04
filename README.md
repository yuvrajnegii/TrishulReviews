# TrishulReviews

> AI-powered guest review classification tool for Trishul Eco-Homestays, Uttarakhand.

![GitHub stars](https://img.shields.io/github/stars/yuvrajnegii/TrishulReviews?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/yuvrajnegii/TrishulReviews?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/yuvrajnegii/TrishulReviews?style=for-the-badge&logo=github) ![Last commit](https://img.shields.io/github/last-commit/yuvrajnegii/TrishulReviews?style=for-the-badge&logo=github)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 🌐 Live Demo

**Frontend:** [https://trishul-reviews.vercel.app](https://trishul-reviews.vercel.app)

**Backend:** [https://trishulreviews-api.onrender.com](https://trishulreviews-api.onrender.com)

## 🎬 Demo Video

[Watch on YouTube](https://youtube.com) ← *(update this link after recording)*

---

## 📸 Screenshots

| Login | Home Dashboard |
|---|---|
| ![Login](https://raw.githubusercontent.com/yuvrajnegii/TrishulReviews/main/assets/screenshot_login.png) | ![Home](https://raw.githubusercontent.com/yuvrajnegii/TrishulReviews/main/assets/screenshot_home.png) |

| Classify | History |
|---|---|
| ![Classify](https://raw.githubusercontent.com/yuvrajnegii/TrishulReviews/main/assets/screenshot_classify.png) | ![History](https://raw.githubusercontent.com/yuvrajnegii/TrishulReviews/main/assets/screenshot_history.png) |

---

## 📝 Description

TrishulReviews (GuestLens) is a full-stack review classification tool built for Trishul Eco-Homestays. Small hospitality businesses often lack tools to systematically analyse guest feedback. This app lets staff paste raw reviews, automatically classify them by sentiment and theme using an LLM, generate suggested management responses, and store everything in a searchable database.

---

## ✨ Features

- 🔐 User signup & login with hashed passwords and JWT-based sessions
- 🔵 Google OAuth 2.0 login
- 🤖 AI-powered sentiment & theme classification of guest reviews
- 💬 Auto-generated suggested management responses
- 📋 Review history with search and filter by sentiment, theme, or keyword
- ✏️ Edit and delete previously classified reviews
- 🗑️ Bulk delete multiple reviews at once
- 📊 Live stats dashboard — total reviews, sentiment breakdown, topic distribution
- ✨ AI Insight card — auto-generated summary of review trends
- 🌓 Light/dark theme toggle
- 📱 Responsive design — works on mobile, tablet, and desktop
- 🛡️ Rate limiting on auth endpoints (5 requests/minute per IP)

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React + Vite | Fast builds, component-based UI |
| **Backend** | FastAPI (Python) | Built-in validation, async support, auto docs |
| **Database** | PostgreSQL via Neon | Structured relational data, SQL filtering |
| **AI** | Groq API (llama-3.3-70b-versatile) | Fast inference, reliable JSON output |
| **Auth** | JWT + bcrypt + Google OAuth 2.0 | Secure, stateless authentication |
| **Rate Limiting** | slowapi | Brute force protection on auth endpoints |
| **Frontend Deploy** | Vercel | Free tier, instant GitHub deploys |
| **Backend Deploy** | Render | Free tier, Python support |
| **DB Hosting** | Neon | Serverless PostgreSQL, free tier |

---

## 📂 Folder Structure

```
TrishulReviews/
├── backend/
│   ├── app.py              # FastAPI application — all routes, auth, AI integration
│   ├── schema.sql          # PostgreSQL schema — users and reviews tables
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── pages/          # Home, Classify, History, About, Login, Signup, OAuthCallback
│   │   ├── components/     # Navbar, Footer, Badge, MetricCard, ui (Button, Input, Modal, Toast)
│   │   ├── App.jsx         # Routing and auth gate
│   │   ├── AuthContext.jsx # Global auth state
│   │   ├── ThemeContext.jsx # Light/dark theme
│   │   └── constants.js    # API base URL, styles, sample data
│   └── package.json
├── assets/                 # Screenshots and schema diagram
├── PROMPTS.md              # Prompt engineering log
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (local) or a Neon account
- [Groq API key](https://console.groq.com/keys)

### 1. Clone the repo

```bash
git clone https://github.com/yuvrajnegii/TrishulReviews.git
cd TrishulReviews
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env       # fill in your real values
psql -U postgres -d guestlens -f schema.sql
python app.py
```

Backend runs at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 4. Environment variables

Create `backend/.env` with these variables:

```
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_long_random_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=guestlens
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_SSLMODE=disable
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env`:

```
VITE_API_BASE=http://localhost:8000
```

---

## 📡 API Documentation

All error responses follow the shape `{"error": "message"}` with an appropriate HTTP status code.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/signup` | Create a new user account | No |
| POST | `/login` | Authenticate and receive a JWT | No |
| GET | `/me` | Get the currently authenticated user | Yes |
| POST | `/classify` | Classify reviews and save to DB | Yes |
| GET | `/history` | List the most recent 100 reviews | Yes |
| GET | `/history/search` | Filter by sentiment, theme, keyword | Yes |
| GET | `/history/{id}` | Get a single review | Yes |
| PATCH | `/history/{id}` | Update sentiment/theme/response | Yes |
| DELETE | `/history/{id}` | Delete a review | Yes |
| GET | `/auth/google` | Redirect to Google OAuth | No |
| GET | `/auth/google/callback` | Handle Google OAuth callback | No |
| GET | `/health` | Health check | No |

**Example — classify reviews:**
```
POST /classify
Authorization: Bearer <token>
Content-Type: application/json

{ "reviews": ["The food was amazing!", "Room was dusty and uncomfortable."] }
```

**Example — search:**
```
GET /history/search?sentiment=negative&theme=cleanliness&q=mattress
Authorization: Bearer <token>
```

---

## 🗄️ Database

**Choice: PostgreSQL** — structured, relational data with fixed schemas. SQL filtering maps naturally to sentiment/theme/keyword search. Hosted on **Neon** (serverless PostgreSQL) in production.

### Schema Diagram

![Schema Diagram](https://raw.githubusercontent.com/yuvrajnegii/TrishulReviews/main/assets/W5_SchemaDiagram_TBI-26100259.png)

### Tables

- **`users`** — `id`, `name`, `email`, `password_hash`, `created_at`
- **`reviews`** — `id`, `review_text`, `sentiment`, `theme`, `response`, `created_at`

---

## ⚠️ Known Limitations

- **Render free tier** spins down after 15 minutes of inactivity — first request after idle takes 30–60 seconds.
- **Neon free tier** has 191.9 compute hours/month — sufficient for demo and development use.
- **No connection pooling** — a new DB connection is opened per request. Fine for low traffic.
- **Reviews are shared** — all logged-in users see the same review history (no per-user isolation).
- **No pagination** — history is capped at the last 100 reviews.

---

## 🙏 Credits & Acknowledgements

- **Groq API** — LLM inference for review classification
- **Neon** — Serverless PostgreSQL hosting
- **Vercel** — Frontend deployment
- **Render** — Backend deployment
- **Claude (Anthropic)** — AI assistant used throughout development for architecture planning, debugging, and code generation
- Built as part of the **TBI-GEU AI-Assisted Full Stack Web Development Internship 2026**
