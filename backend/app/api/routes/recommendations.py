"""
Recommendations Router
──────────────────────────────────────────────────────────────────────────────
Phase 1 — Heuristics (active now):
  • /trending      → top movies by vote_count * vote_average
  • /top-rated     → highest vote_average, vote_count > 100
  • /for-you       → genre-weighted heuristic based on profile's liked movies
  • /similar/{id}  → content-based: overlapping genre_ids + keywords

Phase 2 — Content-Based Filtering (activate by uncommenting in /similar):
  • Uses scikit-learn TF-IDF on keywords to compute cosine similarity.

Phase 3 — Collaborative Filtering (future — needs substantial interaction data):
  • Matrix Factorization via Surprise / LightFM.
"""
import json
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.models import Movie, Interaction
from app.schemas.schemas import MovieOut, MovieRowOut

router = APIRouter()

GENRE_NAMES = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime",  18: "Drama",     14: "Fantasy",   27: "Horror",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller",
}


def _to_movie_out(m: Movie) -> MovieOut:
    return MovieOut(
        id=m.id,
        title=m.title,
        overview=m.overview or "",
        poster_path=m.poster_path or "",
        backdrop_path=m.backdrop_path or "",
        release_date=m.release_date or "",
        vote_average=m.vote_average or 0.0,
        vote_count=m.vote_count or 0,
        genre_ids=[int(g) for g in m.genre_ids.split(",") if g] if m.genre_ids else [],
        genres=[],
        runtime=m.runtime,
        director=m.director,
        cast=json.loads(m.cast_json or "[]"),
        keywords=[k.strip() for k in (m.keywords or "").split(",") if k.strip()],
        trailer_key=m.trailer_key,
        maturity_rating=m.maturity_rating,
    )


# ── Phase 1: Trending ─────────────────────────────────────────────────────────

@router.get("/trending", response_model=List[MovieOut])
def get_trending(limit: int = 20, db: Session = Depends(get_db)):
    """
    GET /api/recommendations/trending
    Ranked by: vote_average × log(vote_count) — TMDB-style weighted rating.
    """
    movies = (
        db.query(Movie)
        .order_by((Movie.vote_average * func.log(Movie.vote_count + 1)).desc())
        .limit(limit)
        .all()
    )
    return [_to_movie_out(m) for m in movies]


# ── Phase 1: Top Rated ────────────────────────────────────────────────────────

@router.get("/top-rated", response_model=List[MovieOut])
def get_top_rated(limit: int = 20, db: Session = Depends(get_db)):
    """GET /api/recommendations/top-rated"""
    movies = (
        db.query(Movie)
        .filter(Movie.vote_count > 100)
        .order_by(Movie.vote_average.desc())
        .limit(limit)
        .all()
    )
    return [_to_movie_out(m) for m in movies]


# ── Phase 1 + 2: Similar Movies (genre overlap → content-based) ───────────────

@router.get("/similar/{movie_id}", response_model=List[MovieOut])
def get_similar(movie_id: int, limit: int = 12, db: Session = Depends(get_db)):
    """
    GET /api/recommendations/similar/{movie_id}

    Phase 1: Returns movies sharing at least one genre with the target movie.
    Phase 2 (content-based): Uncomment the scikit-learn block below to rank
    results by TF-IDF cosine similarity on keywords instead.
    """
    target = db.query(Movie).filter(Movie.id == movie_id).first()
    if not target:
        return []

    target_genres = set(target.genre_ids.split(",")) if target.genre_ids else set()
    all_movies = db.query(Movie).filter(Movie.id != movie_id).all()

    # Phase 1 — genre overlap score
    scored = []
    for m in all_movies:
        m_genres = set(m.genre_ids.split(",")) if m.genre_ids else set()
        overlap = len(target_genres & m_genres)
        if overlap > 0:
            scored.append((overlap, m.vote_average, m))

    scored.sort(key=lambda x: (x[0], x[1]), reverse=True)

    # ── Phase 2 (Content-Based Filtering) — uncomment when ready ──────────────
    # from sklearn.feature_extraction.text import TfidfVectorizer
    # from sklearn.metrics.pairwise import cosine_similarity
    # import numpy as np
    #
    # corpus = [target.keywords or ""] + [m.keywords or "" for _, _, m in scored]
    # tfidf  = TfidfVectorizer(stop_words="english")
    # matrix = tfidf.fit_transform(corpus)
    # sims   = cosine_similarity(matrix[0:1], matrix[1:]).flatten()
    # scored = [(sims[i], scored[i][2]) for i in range(len(scored))]
    # scored.sort(key=lambda x: x[0], reverse=True)
    # return [_to_movie_out(m) for _, m in scored[:limit]]
    # ──────────────────────────────────────────────────────────────────────────

    return [_to_movie_out(m) for _, _, m in scored[:limit]]


# ── Phase 1 + Future: For-You Personalised Rows ───────────────────────────────

@router.get("/for-you", response_model=List[MovieOut])
def get_for_you(
    profile_id: str = Query(..., description="Active profile ID"),
    limit: int = 20,
    db: Session = Depends(get_db),
):
    """
    GET /api/recommendations/for-you?profile_id=...

    Phase 1: Weights genres from liked interactions.
    Phase 3: Replace with collaborative filtering (matrix factorization).
    """
    # Fetch movies this profile has already interacted with
    interacted_ids = {
        r.movie_id
        for r in db.query(Interaction.movie_id)
        .filter_by(profile_id=profile_id)
        .all()
    }

    # Count liked genres
    liked = (
        db.query(Interaction)
        .filter_by(profile_id=profile_id, action_type="like")
        .all()
    )
    genre_weight: dict[str, int] = {}
    for interaction in liked:
        movie = db.query(Movie).filter(Movie.id == interaction.movie_id).first()
        if movie and movie.genre_ids:
            for g in movie.genre_ids.split(","):
                genre_weight[g] = genre_weight.get(g, 0) + 1

    # Fetch unseen movies, score by genre weight
    candidates = (
        db.query(Movie)
        .filter(Movie.id.notin_(interacted_ids))
        .order_by(Movie.vote_average.desc())
        .limit(200)
        .all()
    )

    def score(m: Movie) -> float:
        genres = m.genre_ids.split(",") if m.genre_ids else []
        genre_score = sum(genre_weight.get(g, 0) for g in genres)
        return genre_score * 10 + (m.vote_average or 0)

    candidates.sort(key=score, reverse=True)
    return [_to_movie_out(m) for m in candidates[:limit]]


# ── Home Browse Rows ──────────────────────────────────────────────────────────

@router.get("/rows", response_model=List[MovieRowOut])
def get_rows(
    profile_id: str = Query("", description="Active profile ID (optional)"),
    db: Session = Depends(get_db),
):
    """
    GET /api/recommendations/rows
    Returns all the categorised rows shown on the Browse page.
    Replaces the frontend MOVIE_ROWS mock data.
    """
    def top_by_genre(genre_id: int, n: int = 15) -> List[MovieOut]:
        movies = (
            db.query(Movie)
            .filter(Movie.genre_ids.contains(str(genre_id)))
            .order_by(Movie.vote_average.desc())
            .limit(n)
            .all()
        )
        return [_to_movie_out(m) for m in movies]

    trending  = get_trending(20, db)
    top_rated = get_top_rated(15, db)

    rows = [
        MovieRowOut(title="Trending Now",   movies=trending,            endpoint="/api/recommendations/trending"),
        MovieRowOut(title="Top Rated",      movies=top_rated,           endpoint="/api/recommendations/top-rated"),
        MovieRowOut(title="Action",         movies=top_by_genre(28),    endpoint="/api/movies?genre_id=28"),
        MovieRowOut(title="Sci-Fi",         movies=top_by_genre(878),   endpoint="/api/movies?genre_id=878"),
        MovieRowOut(title="Drama",          movies=top_by_genre(18),    endpoint="/api/movies?genre_id=18"),
        MovieRowOut(title="Comedy",         movies=top_by_genre(35),    endpoint="/api/movies?genre_id=35"),
        MovieRowOut(title="Thriller",       movies=top_by_genre(53),    endpoint="/api/movies?genre_id=53"),
        MovieRowOut(title="Animation",      movies=top_by_genre(16),    endpoint="/api/movies?genre_id=16"),
    ]

    # Inject personalised rows when profile is active
    if profile_id:
        for_you = get_for_you(profile_id=profile_id, limit=20, db=db)
        if for_you:
            rows.insert(0, MovieRowOut(
                title="Recommended For You",
                movies=for_you,
                endpoint=f"/api/recommendations/for-you?profile_id={profile_id}",
            ))

        # Add "Because you liked X" row
        liked = db.query(Interaction).filter_by(profile_id=profile_id, action_type="like").all()
        if liked:
            import random
            target_interaction = random.choice(liked)
            target_movie = db.query(Movie).filter(Movie.id == target_interaction.movie_id).first()
            if target_movie:
                similar = get_similar(target_movie.id, limit=15, db=db)
                if similar:
                    rows.insert(1, MovieRowOut(
                        title=f"Because you liked {target_movie.title}",
                        movies=similar,
                        endpoint=f"/api/recommendations/similar/{target_movie.id}",
                    ))

    return rows
