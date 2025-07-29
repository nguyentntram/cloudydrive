# init_db.py

from app.db.database import engine
from app.models.file import Base

Base.metadata.create_all(bind=engine)