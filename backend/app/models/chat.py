from pydantic import BaseModel
from typing import Optional, List


class Answer(BaseModel):
    sdp: str
    type: str


class Offer(BaseModel):
    sdp: str
    type: str


class Chat(BaseModel):
    username: str
    receiver_name: str
    type: str
    offer: Optional[Offer] = None
    answer: Optional[Answer] = None


class MessageResponse(BaseModel):
    username: Optional[List[str]]
    message: str
