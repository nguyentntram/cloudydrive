# app/models/file.py
# Database table
from sqlalchemy import Column, String, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid # use uuid to create unique ID for each file

Base = declarative_base() # create a Base class for all models to inherit -> required for SQLAlchemy

class FileMetadata(Base):
    __tablename__ = "files" # Create a files table in the DB with columns corresponding to file metadata.

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4())) # unique id for each file (use uuid v4)
    filename = Column(String, nullable=False) #  original file name
    s3_key = Column(String, nullable=False) # S3 path (in the form of uploads/abc.jpg)
    filetype = Column(String, nullable=True)
    filesize = Column(Integer, nullable=True)
    upload_time = Column(DateTime, default=datetime.utcnow) # to store upload time

# store file info to PostgreSQL when uploading to S3