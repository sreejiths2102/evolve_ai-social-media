from fastapi import (APIRouter,Depends,HTTPException)
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.like import Like
from app.models.post import Post
from app.models.user import User
from app.services.auth_service import (get_current_user)
from app.services.notification_service import create_notification
router=APIRouter(
    prefix="/likes",
    tags=["Likes"]
)

@router.post("/{post_id}")
def toggle_like(
    post_id:int,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    post=(
        db.query(Post)
        .filter(Post.id==post_id)
        .first()
    )
    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )
    existing_like=(
        db.query(Like)
        .filter(
            Like.user_id==current_user.id,
            Like.post_id==post_id
        )
        .first()
    )
    if existing_like:
        db.delete(existing_like)
        db.commit()
        return{
            "liked":False
        }
    like=Like(
        user_id=current_user.id,
        post_id=post_id
    )
    db.add(like)
    db.commit()
    create_notification(
    db=db,
    user_id=post.user_id,
    actor_id=current_user.id,
    notification_type="like",
    reference_id=post.id
    )
    return{
        "liked":True
    }

@router.get("/{post_id}")
def get_likes(
    post_id:int,
    db:Session=Depends(get_db)
):
    count=(
        db.query(Like)
        .filter(
            Like.post_id==post_id
        )
        .count()
    )
    return{
        "likes":count
    }