from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Interaction, WatchlistItem
from app.schemas.schemas import InteractionRequest, InteractionOut

router = APIRouter()

# Allowed interaction types
VALID_ACTIONS = {"like", "dislike", "watchlist_add", "watchlist_remove", "click", "watch"}


@router.post("/", response_model=InteractionOut, status_code=status.HTTP_201_CREATED)
def log_interaction(body: InteractionRequest, db: Session = Depends(get_db)):
    """
    POST /api/interactions
    Called by the frontend on every like/dislike/click/watch event.
    This is the core data collection endpoint for the ML recommendation model.
    """
    if body.action_type not in VALID_ACTIONS:
        raise HTTPException(status_code=400, detail=f"Invalid action_type. Must be one of: {VALID_ACTIONS}")

    interaction = Interaction(
        profile_id=body.profile_id,
        movie_id=body.movie_id,
        action_type=body.action_type,
    )
    db.add(interaction)

    # Sync watchlist table as a side effect
    if body.action_type == "watchlist_add":
        existing = db.query(WatchlistItem).filter_by(
            profile_id=body.profile_id, movie_id=body.movie_id
        ).first()
        if not existing:
            db.add(WatchlistItem(profile_id=body.profile_id, movie_id=body.movie_id))

    elif body.action_type == "watchlist_remove":
        db.query(WatchlistItem).filter_by(
            profile_id=body.profile_id, movie_id=body.movie_id
        ).delete()

    db.commit()
    db.refresh(interaction)

    return InteractionOut(
        id=interaction.id,
        movie_id=interaction.movie_id,
        action_type=interaction.action_type,
        created_at=str(interaction.created_at),
    )
