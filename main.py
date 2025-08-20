# App Entry Point
from fastapi import FastAPI
from app.routes.files import router as files_router  # import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Thêm CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # chỉ cho frontend này gọi
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gắn router
app.include_router(files_router)

@app.get("/")
def read_root():
    return {"message": "CloudyDrive API is live!"}  # for testing


# Initializes FastAPI app

# Includes the /files router