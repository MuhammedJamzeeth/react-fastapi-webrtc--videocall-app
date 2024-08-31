from fastapi import HTTPException
from passlib.context import CryptContext
from starlette import status

from app.db.database import users_collection
from app.models.user import User, UserResponse, UserRequest
from loguru import logger

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def create_user(req: UserRequest):
    if users_collection is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Database connection is not initialized")
    try:
        existing_user = await users_collection.find_one({"username": req.username})
        if existing_user:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exist")

        hashed_password = pwd_context.hash(req.password)
        user_data = {"username": req.username, "hashed_password": hashed_password}

        await users_collection.insert_one(user_data)
        return req.username

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="An error occurred while creating user")


async def authenticate_user(username: str, password: str):
    if users_collection is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Database connection is not initialized")
    try:
        user_data = await users_collection.find_one({"username": username})
        if not user_data:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username")

        if not pwd_context.verify(password, user_data["hashed_password"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

        return UserResponse(**user_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error authenticating user: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="An error occurred while authenticating user")
