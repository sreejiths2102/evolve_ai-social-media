from fastapi import FastAPI
from app.database.database import engine
from app.models.user import User
from app.database.database import Base
from app.routers.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.routers.profile import (router as profile_router)
from app.routers.character import (router as character_router)
from app.routers.post import (router as post_router)
from app.models.post import Post
from app.services.scheduler import ( start_scheduler)
from sqlalchemy import text
from app.models.follow import Follow
from app.routers.follow import (router as follow_router)
from app.routers.feed import (router as feed_router)
from app.models.like import Like
from app.routers.like import (router as like_router)
from app.models.comment import Comment
from app.routers.comment import (router as comment_router)
from app.models.notification import Notification
from app.routers.notification import (router as notification_router)




Base.metadata.create_all(bind=engine)
app=FastAPI(
    title="AI-Social-Media",
    version="1.0.0"
)
start_scheduler()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(character_router)
app.include_router(post_router)
app.include_router(follow_router)
app.include_router(feed_router)
app.include_router(like_router)
app.include_router(comment_router)
app.include_router(notification_router)

@app.get("/")
def root():
    return{
        "messsage":"Backend Running"
    }