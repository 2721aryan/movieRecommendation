import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.models import Movie, Interaction, WatchlistItem, Profile
from app.schemas.schemas import MovieOut, MovieRowOut, WatchlistItemOut, UserStatsOut

router = APIRouter()


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


@router.get("/{user_id}/watchlist", response_model=List[WatchlistItemOut])
def get_watchlist(user_id: str, db: Session = Depends(get_db)):
    """GET /api/users/{user_id}/watchlist"""
    items = db.query(WatchlistItem).filter(WatchlistItem.profile_id == user_id).all()
    return [WatchlistItemOut(movie_id=i.movie_id, added_at=str(i.added_at)) for i in items]


@router.post("/{user_id}/watchlist")
def add_to_watchlist(user_id: str, body: dict, db: Session = Depends(get_db)):
    """POST /api/users/{user_id}/watchlist — body: { movie_id: int }"""
    movie_id = body.get("movie_id")
    if not movie_id:
        raise HTTPException(status_code=400, detail="movie_id required")
    existing = db.query(WatchlistItem).filter_by(profile_id=user_id, movie_id=movie_id).first()
    if not existing:
        db.add(WatchlistItem(profile_id=user_id, movie_id=movie_id))
        db.commit()
    return {"message": "Added to watchlist"}


@router.delete("/{user_id}/watchlist/{movie_id}")
def remove_from_watchlist(user_id: str, movie_id: int, db: Session = Depends(get_db)):
    """DELETE /api/users/{user_id}/watchlist/{movie_id}"""
    db.query(WatchlistItem).filter_by(profile_id=user_id, movie_id=movie_id).delete()
    db.commit()
    return {"message": "Removed from watchlist"}


@router.get("/{user_id}/stats", response_model=UserStatsOut)
def get_stats(user_id: str, db: Session = Depends(get_db)):
    """GET /api/users/{user_id}/stats"""
    total_watched = db.query(Interaction).filter_by(profile_id=user_id, action_type="watch").count()
    total_liked   = db.query(Interaction).filter_by(profile_id=user_id, action_type="like").count()
    watchlist_count = db.query(WatchlistItem).filter_by(profile_id=user_id).count()
    return UserStatsOut(
        total_watched=total_watched,
        total_liked=total_liked,
        watchlist_count=watchlist_count,
    )
