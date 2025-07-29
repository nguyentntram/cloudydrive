# API endpoints
from fastapi import APIRouter, UploadFile, File
from app.services.s3_service import upload_file_to_s3, generate_upload_url

# Assign the /files prefix to the routes in this file
router = APIRouter(prefix="/files", tags=["Files"]) # help modularize routes

@router.get("/") # check if api is live!
def root():
    return {"message": "CloudyDrive API is live!"}

@router.get("/upload-url")
def get_upload_url(fileName: str):
    url, key = generate_upload_url(fileName)
    return {"uploadUrl": url, "s3Key": key}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    url, key = upload_file_to_s3(file)
    return {"s3Url": url, "s3Key": key}

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.file import FileMetadata
from app.schemas.file import FileOut
from typing import List

@router.get("/list", response_model=List[FileOut])
def get_all_files():
    db: Session = SessionLocal()
    files = db.query(FileMetadata).order_by(FileMetadata.upload_time.desc()).all()
    db.close()
    return files