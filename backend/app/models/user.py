from bson import ObjectId
from pydantic import BaseModel, Field


class User(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    username: str
    hashed_password: str


class UserRequest(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    username: str
