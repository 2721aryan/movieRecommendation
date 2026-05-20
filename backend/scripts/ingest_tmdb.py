"""
TMDB Ingestion Script
------------------------------------------------------------------------------
Run this script once to seed the database, and again periodically to refresh.

Usage:
    python -m scripts.ingest_tmdb

What it does:
  1. Fetches top-rated, trending, and popular movies from TMDB (pages 1-10).
  2. For each movie, fetches credits (director/cast) and keywords.
  3. Upserts into the local `movies` table.
"""
import sys
import json
import time
import requests
from pathlib import Path

# Make sure we can import from the app package
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.core.database import SessionLocal, engine
from app.core.config import settings
from app.models.models import Base, Movie

Base.metadata.create_all(bind=engine)

TMDB_BASE = settings.TMDB_BASE_URL
TMDB_KEY  = settings.TMDB_API_KEY

# Use a persistent session with a proper User-Agent so TMDB doesn't block us
SESSION = requests.Session()
SESSION.headers.update({
    "accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
})


def tmdb_get(path: str, params: dict = {}, retries: int = 3) -> dict:
    """v3 API key is passed as a query parameter, not a Bearer token."""
    url = f"{TMDB_BASE}{path}"
    all_params = {"api_key": TMDB_KEY, **params}
    for attempt in range(1, retries + 1):
        try:
            resp = SESSION.get(url, params=all_params, timeout=15)
            resp.raise_for_status()
            return resp.json()
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
            if attempt < retries:
                wait = attempt * 3
                print(f"  [RETRY {attempt}] Connection error, retrying in {wait}s...")
                time.sleep(wait)
            else:
                raise e


def fetch_movie_ids(endpoint: str, pages: int = 5) -> list:
    ids = []
    for page in range(1, pages + 1):
        data = tmdb_get(endpoint, {"page": page})
        ids.extend(m["id"] for m in data.get("results", []))
        time.sleep(0.25)  # be polite to TMDB rate limits
    return list(set(ids))


def fetch_movie_detail(movie_id: int) -> dict | None:
    try:
        detail   = tmdb_get(f"/movie/{movie_id}")
        time.sleep(0.15)
        credits  = tmdb_get(f"/movie/{movie_id}/credits")
        time.sleep(0.15)
        keywords = tmdb_get(f"/movie/{movie_id}/keywords")
        time.sleep(0.15)
        videos   = tmdb_get(f"/movie/{movie_id}/videos")

        director = next(
            (c["name"] for c in credits.get("crew", []) if c["job"] == "Director"),
            None,
        )
        cast = [
            {"id": c["id"], "name": c["name"], "character": c["character"],
             "profile_path": c.get("profile_path")}
            for c in credits.get("cast", [])[:10]
        ]
        kw_list  = [k["name"] for k in keywords.get("keywords", [])]
        trailer  = next(
            (v["key"] for v in videos.get("results", [])
             if v["type"] == "Trailer" and v["site"] == "YouTube"),
            None,
        )
        genre_ids = ",".join(str(g["id"]) for g in detail.get("genres", []))

        return {
            "id":             detail["id"],
            "title":          detail.get("title", ""),
            "overview":       detail.get("overview", ""),
            "poster_path":    detail.get("poster_path", ""),
            "backdrop_path":  detail.get("backdrop_path", ""),
            "release_date":   detail.get("release_date", ""),
            "vote_average":   detail.get("vote_average", 0.0),
            "vote_count":     detail.get("vote_count", 0),
            "runtime":        detail.get("runtime"),
            "director":       director,
            "trailer_key":    trailer,
            "maturity_rating": "PG-13",
            "genre_ids":      genre_ids,
            "keywords":       ", ".join(kw_list),
            "cast_json":      json.dumps(cast),
        }
    except Exception as e:
        print(f"  [SKIP] movie_id={movie_id} - {e}")
        return None


def upsert_movie(db, data: dict):
    existing = db.query(Movie).filter(Movie.id == data["id"]).first()
    if existing:
        for k, v in data.items():
            setattr(existing, k, v)
    else:
        db.add(Movie(**data))


def run():
    if not TMDB_KEY:
        print("ERROR: TMDB_API_KEY not set in .env")
        sys.exit(1)

    print("=== NFLIX TMDB Ingestion ===")
    db = SessionLocal()

    endpoints = [
        ("/movie/popular",       5),
        ("/movie/top_rated",     5),
        ("/trending/movie/week", 3),
    ]

    all_ids = set()
    for endpoint, pages in endpoints:
        print(f"Fetching IDs from {endpoint} ({pages} pages)...")
        ids = fetch_movie_ids(endpoint, pages)
        all_ids.update(ids)

    print(f"\nTotal unique movies to sync: {len(all_ids)}")

    for i, movie_id in enumerate(all_ids, 1):
        print(f"[{i}/{len(all_ids)}] Syncing movie {movie_id}...", end=" ", flush=True)
        data = fetch_movie_detail(movie_id)
        if data:
            upsert_movie(db, data)
            print("OK")
        if i % 50 == 0:
            db.commit()
            print(f"  -- Batch {i} committed to Neon")
        time.sleep(0.3)  # TMDB rate limit: ~40 req/s

    db.commit()
    db.close()
    print("\nIngestion complete!")


if __name__ == "__main__":
    run()
