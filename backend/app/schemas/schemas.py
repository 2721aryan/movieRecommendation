from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Profile ───────────────────────────────────────────────────────────────────

class ProfileOut(BaseModel):
    id: str
    name: str
    avatar: str
    favorite_genres: List[int] = []
    language: str = "en"

    @field_validator("favorite_genres", mode="before")
    @classmethod
    def parse_favorite_genres(cls, v):
        """DB stores genres as a comma-separated string like '28,12,878'."""
        if isinstance(v, list):
            return v
        if not v or not isinstance(v, str) or v.strip() == "":
            return []
        return [int(x) for x in v.split(",") if x.strip().isdigit()]

    class Config:
        from_attributes = True


# ── User ──────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    email: str
    name: str
    profiles: List[ProfileOut] = []
    active_profile: Optional[ProfileOut] = None

    class Config:
        from_attributes = True


# ── Movie ─────────────────────────────────────────────────────────────────────

class CastMember(BaseModel):
    id: int
    name: str
    character: str
    profile_path: Optional[str] = None


class MovieOut(BaseModel):
    id: int
    title: str
    overview: str
    poster_path: str
    backdrop_path: str
    release_date: str
    vote_average: float
    vote_count: int
    genre_ids: List[int] = []
    genres: List[dict] = []
    runtime: Optional[int] = None
    director: Optional[str] = None
    cast: List[CastMember] = []
    keywords: List[str] = []
    trailer_key: Optional[str] = None
    maturity_rating: Optional[str] = None

    class Config:
        from_attributes = True


class MovieRowOut(BaseModel):
    title: str
    movies: List[MovieOut]
    endpoint: Optional[str] = None


# ── Interaction ───────────────────────────────────────────────────────────────

class InteractionRequest(BaseModel):
    movie_id: int
    action_type: str   # like | dislike | watchlist_add | watchlist_remove | click | watch
    profile_id: str


class InteractionOut(BaseModel):
    id: str
    movie_id: int
    action_type: str
    created_at: str

    class Config:
        from_attributes = True


# ── Watchlist ─────────────────────────────────────────────────────────────────

class WatchlistItemOut(BaseModel):
    movie_id: int
    added_at: str

    class Config:
        from_attributes = True


# ── User Stats ────────────────────────────────────────────────────────────────

class UserStatsOut(BaseModel):
    total_watched: int
    total_liked: int
    watchlist_count: int
