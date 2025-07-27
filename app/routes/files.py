from fastapi import APIRouter, UploadFile, File
from app.services.s3_service import upload_file_to_s3, generate_upload_url

router = APIRouter(prefix="/files", tags=["Files"]) 

@router.get("/")
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
