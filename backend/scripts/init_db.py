"""
Database Initialization Script
Run once before starting the server for the first time:
    python -m scripts.init_db
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.core.database import engine
from app.models.models import Base

def run():
    print("Creating all database tables…")
    Base.metadata.create_all(bind=engine)
    print("SUCCESS: Database tables created successfully!")

if __name__ == "__main__":
    run()
