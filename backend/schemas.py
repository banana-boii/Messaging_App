# Pydantic schemas (request/response)

from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    user_id: int
    email: str
    created_at: datetime

    class Config:
        orm_mode = True

class MessageCreate(BaseModel):
    sender_id: int
    receiver_id: int
    content: str

class MessageOut(BaseModel):
    message_id: int
    sender_id: int
    receiver_id: int
    content: str
    sent_at: datetime

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: str
    password: str

class FriendshipCreate(BaseModel):
    user_id: int
    friend_email: str