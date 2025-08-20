# app/schemas/file.py
# Response Schema
from pydantic import BaseModel  # FastAPI library to validate data and define schema
from datetime import datetime

class FileOut(BaseModel): # use FileOut as schema when returning list of files.

    id: str
    filename: str
    s3_key: str
    filetype: str | None = None
    filesize: int | None = None
    upload_time: datetime

    class Config:
        orm_mode = True # lets FastAPI convert SQLAlchemy objects to JSON automatically.
# Returns a list of files with beautiful, clear, API-compliant metadata