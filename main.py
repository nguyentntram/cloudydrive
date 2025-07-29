# App Entry Point
from fastapi import FastAPI
from app.routes.files import router as files_router  #import router

app = FastAPI()

app.include_router(files_router)  # use router # Gắn route

@app.get("/")
def read_root():
    return {"message": "CloudyDrive API is live!"} # for testing

# Initializes FastAPI app

# Includes the /files router