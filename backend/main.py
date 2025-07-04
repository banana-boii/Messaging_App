 # FastAPI entry point

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import SessionLocal, engine
import hashlib


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend requests (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000","http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/",response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

@app.post("/messages/", response_model=schemas.MessageOut)
def send_message(msg: schemas.MessageCreate, db: Session = Depends(get_db)):
    return crud.create_message(db, msg)

@app.get("/messages/{user1_id}/{user2_id}", response_model=list[schemas.MessageOut])
def get_chat(user1_id: int, user2_id: int, db: Session = Depends(get_db)):
    return crud.get_messages_between_users(db, user1_id, user2_id)

@app.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    if db_user.password_hash != hashed:
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    return {
        "user_id": db_user.user_id,
        "email": db_user.email,
        "message": "Login successful"
    }

@app.post("/add-friend/")
def add_friend(request: schemas.FriendshipCreate, db: Session = Depends(get_db)):
    current_user = db.query(models.User).filter(models.User.user_id == request.user_id).first()
    friend_user = db.query(models.User).filter(models.User.email == request.friend_email).first()

    if not friend_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    #Prevent adding adding self or duplicate
    if current_user.user_id == friend_user.user_id:
        raise HTTPException(status_code=400, detail="Cannot add yourself")
    
    existing = db.query(models.Friends).filter_by(
        user_id=current_user.user_id,
        friend_id=friend_user.user_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already added")
    
    crud.add_friend(db=db, user_id=current_user.user_id, friend_id=friend_user.user_id)

    return {"message": "Friend added!"}

@app.get("/users/search")
def search_user(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, details="User not found")
    return {"user_id": user.user_id, "email":user.email}

@app.get("/friends/{user_id}")
def get_friends(user_id: int, db: Session = Depends(get_db)):
    friends = db.query(models.Friends).filter(models.Friends.user_id == user_id).all()
    friend_list = []
    for f in friends:
        friend = db.query(models.User).filter(models.User.user_id == f.friend_id).first()
        if friend:
            friend_list.append({"user_id": friend.user_id, "email": friend.email})
    return friend_list

@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response
