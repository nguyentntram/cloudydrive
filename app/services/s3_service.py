import boto3
import os
from dotenv import load_dotenv
from datetime import datetime
from botocore.exceptions import ClientError
from app.config import S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION

load_dotenv()

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
print("DEBUG - BUCKET_NAME:", BUCKET_NAME)
print("DEBUG - ACCESS_KEY:", os.getenv("AWS_ACCESS_KEY_ID"))
print("DEBUG - SECRET_KEY:", os.getenv("AWS_SECRET_ACCESS_KEY"))
print("DEBUG - REGION:", os.getenv("AWS_REGION"))

def upload_file_to_s3(file):
    file_content = file.file.read()
    file_key = f"uploads/{file.filename}"

    s3.put_object(Bucket=BUCKET_NAME, Key=file_key, Body=file_content)

    s3_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_key}"
    return s3_url, file_key

def generate_upload_url(file_name: str):
    return "https://dummy-upload-url.com", f"files/{file_name}"

def delete_file_from_s3(file_key: str) -> bool:
    try:
        s3.delete_object(Bucket=S3_BUCKET_NAME, Key=file_key)
        return True
    except ClientError as e:
        print(f"Error deleting file from S3: {e}")
        return False