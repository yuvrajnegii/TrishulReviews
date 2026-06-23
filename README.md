# TrishulReviews

![GitHub stars](https://img.shields.io/github/stars/yuvrajnegii/TrishulReviews?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/yuvrajnegii/TrishulReviews?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/yuvrajnegii/TrishulReviews?style=for-the-badge&logo=github) ![Last commit](https://img.shields.io/github/last-commit/yuvrajnegii/TrishulReviews?style=for-the-badge&logo=github)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## 📝 Description

TrishulReviews (GuestLens) is a full-stack review classification tool for
Trishul Eco-Homestays. Guest reviews are pasted into the app, automatically
classified by sentiment and theme using an LLM (via Groq), and saved to a
database where they can be browsed, searched, edited, and deleted. The app
is gated behind user signup/login.

## ✨ Features

- 🔐 User signup & login with hashed passwords and JWT-based sessions
- 🤖 AI-powered sentiment & theme classification of guest reviews
- 📋 Review history with search/filter by sentiment, theme, or keyword
- ✏️ Edit and delete previously classified reviews
- 🌓 Light/dark theme toggle

## 🛠️ Tech Stack

**Frontend**
- 🟨 **JavaScript**
- ⚛️ **React**
- ⚡ **Vite**

**Backend**
- 🐍 **Python**
- 🚀 **FastAPI**
- 🐘 **PostgreSQL**
- 🔑 **JWT (PyJWT) + bcrypt** for authentication
- 🧠 **Groq** for AI review classification

## 📂 Project Structure

```
TrishulReviews/
├── backend/          FastAPI app (auth + review classification API)
│   ├── app.py
│   ├── schema.sql
│   ├── requirements.txt
│   └── .env.example
└── frontend/         React + Vite app (login/signup gated UI)
    ├── src/
    └── package.json
```

## 🚀 Getting Started

### How to run backend locally

**Prerequisites:** Python 3.10+, PostgreSQL, a [Groq API key](https://console.groq.com/keys)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env       # then fill in your real values
psql -U postgres -d guestlens -f schema.sql
python app.py
```

The API runs at `http://localhost:8000`. Interactive docs at
`http://localhost:8000/docs`. Verify it's up:

```bash
curl http://localhost:8000/health
```

### How to run frontend locally

```bash
cd frontend
npm install
npm run dev
```

The app runs at the URL Vite prints (usually `http://localhost:5173`). Make
sure the backend is running first — sign up or log in to reach the rest of
the app.

## 📡 API Endpoints

| Method | Endpoint             | Description                                     | Auth required |
|--------|------------------------|--------------------------------------------------|----------------|
| POST   | `/signup`              | Create a new user account                        | No             |
| POST   | `/login`               | Authenticate and receive a session token          | No             |
| GET    | `/me`                  | Get the currently authenticated user              | Yes            |
| POST   | `/classify`            | Classify a batch of reviews and save them         | No             |
| GET    | `/history`             | List the most recent reviews                      | No             |
| GET    | `/history/search`      | Filter reviews by sentiment, theme, or keyword    | No             |
| GET    | `/history/{id}`        | Get a single review by id                         | No             |
| PATCH  | `/history/{id}`        | Update a review's sentiment/theme/response        | No             |
| DELETE | `/history/{id}`        | Delete a review by id                             | No             |
| GET    | `/health`              | Health check                                      | No             |

All error responses follow the shape `{"error": "message"}` with an
appropriate HTTP status code (`400`, `401`, `404`, `409`, `422`, `500`, `502`).

**Example — search/filter:**
```
GET /history/search?sentiment=negative&theme=cleanliness&q=mattress
```

**Example — update a review:**
```
PATCH /history/4
Content-Type: application/json

{ "sentiment": "neutral", "response": "We're looking into this." }
```
