# API endpoints
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.s3_service import upload_file_to_s3, generate_upload_url, delete_file_from_s3, generate_download_url

from datetime import datetime
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.file import FileMetadata
from app.schemas.file import FileOut
from typing import List
from pydantic import BaseModel
import pdfplumber
import io
import boto3

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
    content = await file.read()
    file_size = len(content)
    file.file.seek(0)
    url, key = upload_file_to_s3(file)
    db: Session = SessionLocal()
    try:
        new_file = FileMetadata(
            filename=file.filename,
            filetype=file.content_type,
            filesize=file_size,
            s3_key=key,
            upload_time=datetime.utcnow()
        )
        db.add(new_file)
        db.commit()
        db.refresh(new_file)

        return {
            "id": new_file.id,
            "filename": new_file.filename,
            "fileType": new_file.filetype,
            "fileSize": new_file.filesize,
            "s3Key": new_file.s3_key,
            "s3Url": url,
            "uploadTime": new_file.upload_time
        }
    finally:
        db.close()

@router.get("/list", response_model=List[FileOut])
def get_all_files():
    db: Session = SessionLocal()
    try:
        files = db.query(FileMetadata).order_by(FileMetadata.upload_time.desc()).all()
        return files
    finally:
        db.close()
    

@router.delete("/{file_id}")
def delete_file(file_id: str):
    db: Session = SessionLocal()
    try:
        file = db.query(FileMetadata).filter(FileMetadata.id == file_id).first()

        if not file:
            raise HTTPException(status_code=404, detail="File not found")

        # delete in S3
        deleted_from_s3 = delete_file_from_s3(file.s3_key)
        if not deleted_from_s3:
            raise HTTPException(status_code=500, detail="Failed to delete file from S3")

        # delete in DB
        db.delete(file)
        db.commit()
        return {"message": "File deleted successfully"}
    finally:
        db.close()

@router.get("/download-url/{file_id}")
def get_download_url(file_id: str):
    db: Session = SessionLocal()
    try:
        file = db.query(FileMetadata).filter(FileMetadata.id == file_id).first()

        if not file:
            raise HTTPException(status_code=404, detail="File not found")
    
        url = generate_download_url(file.s3_key)
        return {"downloadUrl": url, "filename": file.filename}
    finally:
        db.close()

class FileRegisterIn(BaseModel):
    fileName: str
    fileType: str
    fileSize: int
    s3Key: str

@router.post("/register")
def register_file(meta: FileRegisterIn):
    db: Session = SessionLocal()
    try:
        new_file = FileMetadata(
            filename=meta.fileName,
            filetype=meta.fileType,
            filesize=meta.fileSize,
            s3_key=meta.s3Key,
            upload_time=datetime.utcnow()
        )
        db.add(new_file)
        db.commit()
        db.refresh(new_file)
        return {
            "id": new_file.id,
            "filename": new_file.filename,
            "fileType": new_file.filetype,
            "fileSize": new_file.filesize,
            "s3Key": new_file.s3_key,
            "uploadTime": new_file.upload_time
        }
    finally:
        db.close()

@router.get("/{file_id}/preview")
def preview_file(file_id: str):
    db: Session = SessionLocal()
    try:
        file = db.query(FileMetadata).filter(FileMetadata.id == file_id).first()
        if not file:
            raise HTTPException(status_code=404, detail="File not found")

        s3 = boto3.client("s3")
        bucket = "cloudydrive-tram"

        # TXT preview
        if file.filename.lower().endswith(".txt"):
            obj = s3.get_object(Bucket=bucket, Key=file.s3_key)
            content = obj['Body'].read().decode("utf-8", errors="ignore")
            preview = " ".join(content.split()[:200])
            return {"preview": preview}

        # PDF preview
        elif file.filename.lower().endswith(".pdf"):
            try:
                obj = s3.get_object(Bucket=bucket, Key=file.s3_key)
            except s3.exceptions.NoSuchKey:
                raise HTTPException(status_code=404, detail="File not found in S3")

            pdf_bytes = obj['Body'].read()
            if not pdf_bytes:
                return {"preview": "PDF is empty."}

            try:
                with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                    text = ""
                    for page in pdf.pages[:2]:  # Only first 2 pages
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text
                preview = " ".join(text.split()[:200]) if text else "[PDF has no extractable text]"
                return {"preview": preview}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"PDF parsing failed: {str(e)}")

        else:
            return {"message": "Preview not supported for this file type"}

    finally:
        db.close()