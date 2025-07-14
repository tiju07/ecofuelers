from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError
from pydantic import ValidationError

# Handle insufficient data for recommendations (TC#17)
class InsufficientDataError(Exception):
    def __init__(self, message: str):
        self.message = message

# Handle procurement API failures (TC#38)
class ProcurementAPIError(Exception):
    def __init__(self, message: str):
        self.message = message

def register_error_handlers(app):
    # Handle database connection errors (TC#15)
    @app.exception_handler(OperationalError)
    async def database_connection_error_handler(request: Request, exc: OperationalError):
        return JSONResponse(
            status_code=500,
            content={"error": "Database connection error. Please try again later."},
        )

    # Handle invalid inputs (e.g., negative quantity, TC#16)
    @app.exception_handler(ValidationError)
    async def validation_error_handler(request: Request, exc: ValidationError):
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid input data.", "details": exc.errors()},
        )


    @app.exception_handler(InsufficientDataError)
    async def insufficient_data_error_handler(request: Request, exc: InsufficientDataError):
        return JSONResponse(
            status_code=400,
            content={"error": exc.message},
        )

    # Handle unauthorized access (TC#25–TC#26)
    @app.exception_handler(HTTPException)
    async def unauthorized_access_handler(request: Request, exc: HTTPException):
        if exc.status_code == 401:
            return JSONResponse(
                status_code=401,
                content={"error": "Unauthorized access. Please provide valid credentials."},
            )
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail},
        )

    @app.exception_handler(ProcurementAPIError)
    async def procurement_api_error_handler(request: Request, exc: ProcurementAPIError):
        return JSONResponse(
            status_code=500,
            content={"error": f"Procurement API failure: {exc.message}"},
        )