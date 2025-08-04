# API endpoints
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.s3_service import upload_file_to_s3, generate_upload_url, delete_file_from_s3

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
    db: Session = SessionLocal()
    new_file = FileMetadata(
        filename=file.filename,
        s3_key=key,
        upload_time=datetime.utcnow()
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    db.close()

    return {
        "id": new_file.id,
        "filename": new_file.filename,
        "s3Key": new_file.s3_key,
        "uploadTime": new_file.upload_time
    }

from datetime import datetime
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

@router.delete("/{file_id}")
def delete_file(file_id: str):
    db: Session = SessionLocal()
    file = db.query(FileMetadata).filter(FileMetadata.id == file_id).first()

    if not file:
        db.close()
        raise HTTPException(status_code=404, detail="File not found")

    # delete in S3
    deleted_from_s3 = delete_file_from_s3(file.s3_key)
    if not deleted_from_s3:
        db.close()
        raise HTTPException(status_code=500, detail="Failed to delete file from S3")

    # delete in DB
    db.delete(file)
    db.commit()
    db.close()

    return {"message": "File deleted successfully"}
