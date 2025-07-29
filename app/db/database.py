# app/db/database.py
# connect to local postgresql.
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# PostgreSQL connection string (need a real connection to store metadata in postgresql)
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL) # set up connection
SessionLocal = sessionmaker(bind=engine) # create DB session when querying or inserting data in route