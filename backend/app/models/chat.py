from pydantic import BaseModel


class Offer(BaseModel):
    sdp: str
    type: str


class Chat(BaseModel):
    username: str
    receiver_name: str
    type: str
    offer: Offer
