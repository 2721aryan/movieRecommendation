import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean,
    DateTime, Text, ForeignKey, ARRAY
)
from sqlalchemy.orm import relationship

from app.core.database import Base


# ── Users & Profiles ──────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id            = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email         = Column(String, unique=True, nullable=False, index=True)
    name          = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at    = Column(DateTime, default=datetime.utcnow)

    profiles      = relationship("Profile", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id             = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id        = Column(String, ForeignKey("users.id"), nullable=False)
    name           = Column(String, nullable=False)
    avatar         = Column(String, default="/images/profiles/avatar1.png")
    # Stored as comma-separated genre IDs e.g. "28,12,878"
    favorite_genres = Column(String, default="")
    language       = Column(String, default="en")
    maturity_level = Column(String, default="all")   # all | teen | adult
    created_at     = Column(DateTime, default=datetime.utcnow)

    user           = relationship("User", back_populates="profiles")
    interactions   = relationship("Interaction", back_populates="profile", cascade="all, delete-orphan")
    watchlist      = relationship("WatchlistItem", back_populates="profile", cascade="all, delete-orphan")


# ── Movies (local TMDB cache) ─────────────────────────────────────────────────

class Movie(Base):
    __tablename__ = "movies"

    id              = Column(Integer, primary_key=True)   # TMDB movie ID
    title           = Column(String, nullable=False)
    overview        = Column(Text, default="")
    poster_path     = Column(String, default="")
    backdrop_path   = Column(String, default="")
    release_date    = Column(String, default="")
    vote_average    = Column(Float, default=0.0)
    vote_count      = Column(Integer, default=0)
    runtime         = Column(Integer, nullable=True)
    director        = Column(String, nullable=True)
    trailer_key     = Column(String, nullable=True)      # YouTube key
    maturity_rating = Column(String, default="PG-13")
    # Genre IDs stored as comma-separated string e.g. "28,12,878"
    genre_ids       = Column(String, default="")
    # Keywords for content-based filtering
    keywords        = Column(Text, default="")
    # Cast stored as JSON string
    cast_json       = Column(Text, default="[]")
    synced_at       = Column(DateTime, default=datetime.utcnow)

    interactions    = relationship("Interaction", back_populates="movie")
    watchlist_items = relationship("WatchlistItem", back_populates="movie")


# ── User Interactions (ML training data) ─────────────────────────────────────

class Interaction(Base):
    __tablename__ = "interactions"

    id          = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id  = Column(String, ForeignKey("profiles.id"), nullable=False, index=True)
    movie_id    = Column(Integer, ForeignKey("movies.id"), nullable=False, index=True)
    # like | dislike | watchlist_add | watchlist_remove | click | watch
    action_type = Column(String, nullable=False)
    created_at  = Column(DateTime, default=datetime.utcnow, index=True)

    profile     = relationship("Profile", back_populates="interactions")
    movie       = relationship("Movie", back_populates="interactions")


# ── Watchlist ─────────────────────────────────────────────────────────────────

class WatchlistItem(Base):
    __tablename__ = "watchlist"

    id          = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id  = Column(String, ForeignKey("profiles.id"), nullable=False, index=True)
    movie_id    = Column(Integer, ForeignKey("movies.id"), nullable=False)
    added_at    = Column(DateTime, default=datetime.utcnow)

    profile     = relationship("Profile", back_populates="watchlist")
    movie       = relationship("Movie", back_populates="watchlist_items")
