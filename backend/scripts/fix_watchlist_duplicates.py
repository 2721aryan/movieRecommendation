"""
Fix Watchlist Duplicates + Add Unique Constraint
Run once to clean up any existing duplicate watchlist entries:
    python -m scripts.fix_watchlist_duplicates
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from sqlalchemy import text
from app.core.database import engine


def run():
    with engine.connect() as conn:
        # 1. Find and delete duplicate watchlist rows, keeping the earliest one
        print("Removing duplicate watchlist entries…")
        conn.execute(text("""
            DELETE FROM watchlist
            WHERE id NOT IN (
                SELECT MIN(id)
                FROM watchlist
                GROUP BY profile_id, movie_id
            )
        """))
        conn.commit()
        print("Duplicates removed.")

        # 2. Add unique constraint if it doesn't exist
        print("Adding unique constraint on (profile_id, movie_id)…")
        try:
            conn.execute(text("""
                CREATE UNIQUE INDEX IF NOT EXISTS uq_watchlist_profile_movie
                ON watchlist (profile_id, movie_id)
            """))
            conn.commit()
            print("Unique constraint added successfully.")
        except Exception as e:
            print(f"Constraint may already exist: {e}")

    print("Done!")


if __name__ == "__main__":
    run()
