# App Entry Point
from fastapi import FastAPI
from app.routes.files import router as files_router  # import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # dev local
        "https://cloudydrive-frontend.vercel.app",  # production domain
    ],
    allow_origin_regex=r"^https://.*\.vercel\.app$",  # allow preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# router
app.include_router(files_router)

@app.get("/")
def read_root():
    return {"message": "CloudyDrive API is live!"}
