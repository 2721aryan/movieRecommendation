import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Movie
from app.schemas.schemas import MovieOut

router = APIRouter()


def _serialize_movie(m: Movie) -> MovieOut:
    """Convert ORM Movie → MovieOut, parsing stored JSON/CSV fields."""
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
        genres=[],  # frontend resolves genre names from GENRES constant
        runtime=m.runtime,
        director=m.director,
        cast=json.loads(m.cast_json or "[]"),
        keywords=[k.strip() for k in (m.keywords or "").split(",") if k.strip()],
        trailer_key=m.trailer_key,
        maturity_rating=m.maturity_rating,
    )


@router.get("/", response_model=List[MovieOut])
def get_movies(
    skip: int = 0,
    limit: int = 20,
    genre_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """GET /api/movies — paginated list, optionally filtered by genre."""
    query = db.query(Movie)
    if genre_id is not None:
        query = query.filter(Movie.genre_ids.contains(str(genre_id)))
    movies = query.order_by(Movie.vote_average.desc()).offset(skip).limit(limit).all()
    return [_serialize_movie(m) for m in movies]


@router.get("/{movie_id}", response_model=MovieOut)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    """GET /api/movies/{id} — single movie by TMDB ID."""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return _serialize_movie(movie)
