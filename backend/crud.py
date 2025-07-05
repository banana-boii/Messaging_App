# DB logic (create, read, etc.)

from sqlalchemy.orm import Session
from . import models, schemas
import hashlib

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    db_user = models.User(username=user.username, email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_message(db: Session, msg: schemas.MessageCreate):
    db_msg = models.Message(**msg.dict())
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

def get_messages_between_users(db: Session, sender_id: int, receiver_id:int):
    return db.query(models.Message).filter(
        ((models.Message.sender_id == sender_id) & (models.Message.receiver_id == receiver_id)) |
        ((models.Message.sender_id == receiver_id) & (models.Message.receiver_id == sender_id))
    ).all()

def add_friend(db: Session, user_id: int, friend_id: int):
    friend_entry = models.Friends(user_id=user_id, friend_id=friend_id)
    db.add(friend_entry)
    db.commit()
    db.refresh(friend_entry)
    return friend_entry
    