# 🎬 NFLIX — Movie Recommendation System

A full-stack, Netflix-inspired movie discovery and recommendation web application. Browse thousands of real movies sourced from TMDB, build your personal watchlist, like/dislike films to train your recommendations, and get personalised picks that improve as you interact with the platform.

---

## 🌍 Live Demo

> ### 👉 [https://movie-recommendation-git-main-aryan-kumars-projects-c43191b5.vercel.app/](https://movie-recommendation-git-main-aryan-kumars-projects-c43191b5.vercel.app/)

**Click the link above to visit the live site — no setup required!**

> [!NOTE]
> **First load may take 15–30 seconds to show content.** The backend runs on a free-tier cloud server that goes to sleep after inactivity. On your first visit, the browse page may briefly appear blank (just the navbar and footer visible) while the server wakes up. **Wait a moment and the movies will load automatically** — subsequent pages and navigation will be fast.

---

## 📁 Project Structure

```
Movie Recommendation/
├── backend/               # FastAPI REST API (Python)
│   ├── app/
│   │   ├── api/routes/    # Auth, Movies, Recommendations, Interactions, Users
│   │   ├── core/          # Config, Database, Security (JWT + bcrypt)
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   └── main.py        # FastAPI app entry point
│   ├── scripts/
│   │   ├── ingest_tmdb.py # TMDB data ingestion pipeline
│   │   └── init_db.py     # Database table creation
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frontend/              # Next.js 16 App (React 19 + TypeScript)
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/        # Login & Sign-up pages
│   │   └── (main)/        # Browse, Movie Detail, Search, My List, Profile
│   ├── components/        # Reusable UI components
│   ├── context/           # AuthContext (global state)
│   ├── hooks/             # useAuth, useSearch
│   ├── lib/               # API client, constants, TMDB image utils
│   ├── services/          # movie.service, user.service
│   ├── types/             # TypeScript interfaces
│   ├── .env.local.example
│   └── README.md
│
├── PROJECT_REPORT.md      # Full college project report (50-60 pages)
└── README.md              # ← You are here
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏠 **Landing Page** | Hero section with movie collage background, feature highlights, and CTA |
| 🔐 **Auth System** | Register, login, logout with JWT tokens and bcrypt password hashing |
| 👤 **Multi-Profile** | Netflix-style multiple viewer profiles per account |
| 🎞️ **Browse Page** | Categorised rows: Trending, Top Rated, genre rows, personalised rows |
| 🔍 **Search** | Real-time debounced title search with genre filter chips |
| 🎬 **Movie Detail** | Full metadata, cast, trailer link, community score, similar movies |
| ❤️ **Like / Dislike** | Explicit feedback to train your personal recommendations |
| 📋 **My List** | Personal watchlist persisted in both DB and localStorage |
| 🤖 **Recommendations** | Genre-weighted "For You" + "Because you liked X" rows |
| 📊 **Interaction Log** | Every action logged for future ML model training |

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Role |
|------------|---------|------|
| Python | 3.10+ | Primary language |
| FastAPI | 0.115+ | REST API framework |
| SQLAlchemy | 2.0+ | ORM |
| PostgreSQL | 15.x | Database |
| Pydantic | 2.10+ | Validation & serialisation |
| python-jose | 3.3.0 | JWT authentication |
| bcrypt | 4.0.1 | Password hashing |
| Uvicorn | 0.29.0 | ASGI server |

### Frontend
| Technology | Version | Role |
|------------|---------|------|
| Next.js | 16.2.6 | React framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | 12.x | Animations |
| Lucide React | 1.14.0 | Icons |

### External Services
| Service | Purpose |
|---------|---------|
| TMDB API | Movie metadata (cast, genres, keywords, trailers) |
| Neon PostgreSQL | Serverless cloud database |
| YouTube | Trailer embedding via TMDB trailer keys |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (local or [Neon](https://neon.tech) cloud)
- A free [TMDB API key](https://developer.themoviedb.org/)

---

### 1. Clone & Set Up Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env — fill in DATABASE_URL, SECRET_KEY, TMDB_API_KEY

# Create database tables
python -m scripts.init_db

# Seed movies from TMDB (~300-600 movies, takes a few minutes)
python -m scripts.ingest_tmdb

# Start the API server
uvicorn app.main:app --reload --port 8000
```

Backend will be live at **http://localhost:8000**
Swagger docs at **http://localhost:8000/docs**

---

### 2. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend will be live at **http://localhost:3000**

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, receive JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/movies/` | List movies (paginated, genre filter) |
| GET | `/api/movies/search?q=` | Search by title |
| GET | `/api/movies/{id}` | Movie detail |
| GET | `/api/recommendations/trending` | Trending movies |
| GET | `/api/recommendations/top-rated` | Top rated movies |
| GET | `/api/recommendations/for-you?profile_id=` | Personalised picks |
| GET | `/api/recommendations/similar/{id}` | Similar movies |
| GET | `/api/recommendations/rows?profile_id=` | All browse rows |
| POST | `/api/interactions/` | Log interaction (like, dislike, etc.) |
| GET | `/api/users/{id}/watchlist` | Get watchlist |
| POST | `/api/users/{id}/watchlist` | Add to watchlist |
| DELETE | `/api/users/{id}/watchlist/{movie_id}` | Remove from watchlist |

---

## 🤖 Recommendation Engine Phases

The recommendation engine is built in phases, each more sophisticated than the last:

```
Phase 1 ✅ ACTIVE
────────────────────────────────────────────────────────────
  • Trending    → vote_average × log(vote_count + 1)
  • Top Rated   → Sorted by vote_average, filtered vote_count > 100
  • For You     → Genre-weighted scoring from liked movies
  • Similar     → Genre overlap scoring

Phase 2 🔜 READY TO ACTIVATE
────────────────────────────────────────────────────────────
  • Content-Based Filtering using TF-IDF on movie keywords
  • Cosine similarity for "Similar Movies"
  • Uncomment the sklearn block in recommendations.py
  • pip install scikit-learn numpy

Phase 3 🔮 PLANNED
────────────────────────────────────────────────────────────
  • Collaborative Filtering (Matrix Factorisation / SVD)
  • Requires substantial interaction data
  • Libraries: scikit-surprise, lightfm
```

---

## 🗄️ Database Schema

```
users          → id, email, name, password_hash, created_at
profiles       → id, user_id (FK), name, avatar, favorite_genres, language, maturity_level
movies         → id (TMDB), title, overview, poster_path, backdrop_path, release_date,
                 vote_average, vote_count, runtime, director, trailer_key,
                 genre_ids (CSV), keywords (CSV), cast_json, maturity_rating
interactions   → id, profile_id (FK), movie_id (FK), action_type, created_at
watchlist      → id, profile_id (FK), movie_id (FK), added_at
```

**Interaction action types:** `like` | `dislike` | `watchlist_add` | `watchlist_remove` | `click` | `watch`

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build     # Verify build is clean
# Push to GitHub → connect repo on vercel.com → deploy
# Set env var: NEXT_PUBLIC_API_URL=https://your-backend-url
```

### Backend → Railway / Render
```bash
# Set environment variables in Railway/Render dashboard:
# DATABASE_URL, SECRET_KEY, TMDB_API_KEY, ALLOWED_ORIGINS
# Start command: uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Database → Neon
- Create a free project at [neon.tech](https://neon.tech)
- Copy the connection string to `DATABASE_URL` in your backend env

---

## 📄 Project Report

The full college project report (`PROJECT_REPORT.md`) is included in the root of this repository. It covers:

1. Problem Domain Description
2. Literature Survey
3. Major Objectives & Scope
4. Problem Analysis & Requirement Specification
5. Detailed Design — ERD, DFD Level 0/1/2, Architecture
6. Hardware/Software Platform Environment
7. Snapshots of Input & Output *(add screenshots)*
8. Coding — Key implementation details
9. Project Limitations & Future Scope
10. References (35 academic papers + documentation)

---

## 📝 License

This project is for educational purposes.

---

*Built with ❤️ using FastAPI + Next.js + PostgreSQL + TMDB*
