from fastapi import APIRouter
from starlette import status
from starlette.responses import JSONResponse

from app.models.user import UserRequest
from app.services.auth_service import authenticate_user, create_user

router = APIRouter(prefix="/auth", tags=["Auth Management"])


@router.post("/login")
async def login(username: str, password: str):
    user = await authenticate_user(username, password)
    return JSONResponse(content={"message": "User logged in successfully", "User": user.dict()},
                        status_code=status.HTTP_200_OK)


@router.post("/signup")
async def signup(req: UserRequest):
    user = await create_user(req)
    return JSONResponse(content={"message": "User created in successfully", "User": user},
                        status_code=status.HTTP_200_OK)
