# NFLIX Backend

FastAPI-based movie recommendation backend.

## Setup

```bash
# 1. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
copy .env.example .env        # Windows
cp .env.example .env          # macOS/Linux
# Edit .env — add your DATABASE_URL, SECRET_KEY, and TMDB_API_KEY

# 4. Create DB tables
python -m scripts.init_db

# 5. Seed the database from TMDB
python -m scripts.ingest_tmdb

# 6. Start the server
uvicorn app.main:app --reload --port 8000
```

## API Docs

Visit **http://localhost:8000/docs** for interactive Swagger UI once the server is running.

## Recommendation Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Active | Heuristics — trending, top-rated, genre-weighted |
| 2 | 🔜 Ready | Content-based filtering (TF-IDF, scikit-learn) — uncomment in `recommendations.py` |
| 3 | 🔮 Future | Collaborative filtering (matrix factorization) — needs user data |
