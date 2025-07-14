from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.inventory import router as inventory_router
from .routes.auth import router as auth_router
from .utils.error_handlers import register_error_handlers
from .database.init_db import init_db

# Initialize FastAPI app
app = FastAPI(title="Smart Office Inventory API")

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(inventory_router, prefix="/inventory", tags=["Inventory"])
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Register custom exception handlers
register_error_handlers(app)

# Initialize database connection
@app.on_event("startup")
def startup_event():
    init_db()

@app.on_event("shutdown")
async def shutdown_event():
    # Add any cleanup logic if necessary
    pass

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Office Inventory API"}