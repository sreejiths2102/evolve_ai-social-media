from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database.database import get_db
from app.models.user import User
from app.services.auth_service import get_current_user
from app.schemas.profile import ProfileUpdateRequest
from app.schemas.character import PostingStatus
from app.models.post import Post
from app.models.follow import Follow
from app.models.like import Like
from app.models.comment import Comment
from sqlalchemy import or_


router=APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

@router.get("/me")
def get_public_profile(
    current_user:User= Depends(
        get_current_user
    ),
    db:Session=Depends(get_db)
):
    from datetime import datetime, timedelta, timezone
    from app.services.scheduler import scheduler

    next_auto_post_at_str = None
    if current_user.auto_post_enabled:
        if current_user.last_auto_post_at is None:
            jobs = scheduler.get_jobs()
            if jobs:
                next_run = jobs[0].next_run_time
                if next_run:
                    if next_run.tzinfo is None:
                        next_auto_post_at_str = next_run.isoformat() + "Z"
                    else:
                        next_auto_post_at_str = next_run.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
            if not next_auto_post_at_str:
                next_auto_post_at_str = (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat().replace("+00:00", "Z")
        else:
            next_run = current_user.last_auto_post_at + timedelta(days=current_user.posting_frequency)
            next_auto_post_at_str = next_run.isoformat() + "Z"

    post_count = db.query(Post).filter(Post.user_id == current_user.id).count()
    followers_count = db.query(Follow).filter(Follow.following_id == current_user.id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == current_user.id).count()

    return {
        "id": current_user.id,
        "character_name": current_user.character_name,
        "character_description": current_user.character_description,
        "character_personality": current_user.character_personality,
        "interests": current_user.interests,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "bio": current_user.bio,
        "auto_post_enabled": current_user.auto_post_enabled,
        "posting_frequency": current_user.posting_frequency,
        "character_goal": current_user.character_goal,
        "profile_picture": current_user.profile_picture,
        "post_count": post_count,
        "followers_count": followers_count,
        "following_count": following_count,
        "last_auto_post_at": current_user.last_auto_post_at.isoformat() + "Z" if current_user.last_auto_post_at else None,
        "next_auto_post_at": next_auto_post_at_str
    }

@router.put("/me")
def update_profile(
    request:ProfileUpdateRequest,
    db:Session=Depends(get_db),
    current_user:User = Depends(get_current_user)
):
    current_user.full_name=request.full_name
    current_user.bio=request.bio
    current_user.profile_picture=(request.profile_picture)

    db.commit()
    db.refresh(current_user)
    return{
        "message":"Profile updated"
    }

@router.get("/search")
def search_users(
    q:str,
    db:Session=Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    users=(
        db.query(User)
        .filter(
            or_(User.username.ilike(f"%{q}%"),
                User.character_name.ilike(f"%{q}"),
                User.character_description.ilike(f"%{q}%"),
                User.interests.ilike(f"%{q}%")
            )
        )
        .limit(20)
        .all()
    )
    result = []
    for user in users:
        is_following = False
        is_self = False
        if current_user:
            is_self = (user.id == current_user.id)
            is_following = db.query(Follow).filter(
                Follow.follower_id == current_user.id,
                Follow.following_id == user.id
            ).first() is not None
        result.append({
            "id": user.id,
            "username": user.username,
            "character_name": user.character_name,
            "character_description": user.character_description,
            "is_following": is_following,
            "is_self": is_self
        })
    return result

@router.get("/{username}")
def get_profile(
    username:str,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    user=(
        db.query(User)
        .filter(
            User.username==username
        )
        .first()
    )
    if not user:
        return{
            "message":"User not found"
        }
    posts=(
        db.query(Post)
        .filter(
            Post.user_id==user.id
        )
        .order_by(
            Post.created_at.desc()
        )
        .all()
    )
    
    is_following = False
    is_self = False
    if current_user:
        is_self = (user.id == current_user.id)
        is_following = db.query(Follow).filter(
            Follow.follower_id == current_user.id,
            Follow.following_id == user.id
        ).first() is not None

    post_count = db.query(Post).filter(Post.user_id == user.id).count()
    followers_count = db.query(Follow).filter(Follow.following_id == user.id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == user.id).count()

    return {
        "username": user.username,
        "character_name": user.character_name,
        "character_description": user.character_description,
        "character_personality": user.character_personality,
        "interests": user.interests,
        "is_following": is_following,
        "is_self": is_self,
        "post_count": post_count,
        "followers_count": followers_count,
        "following_count": following_count,
        "posts": [
            {
                "id": post.id,
                "content": post.content,
                "likes": db.query(Like).filter(Like.post_id == post.id).count(),
                "comments": db.query(Comment).filter(Comment.post_id == post.id).count()
            }
            for post in posts
        ]
    }


@router.patch("/posting")
def update_posting_status(
    data: PostingStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    current_user.auto_post_enabled = data.posting_enabled

    db.commit()

    db.refresh(current_user)

    return {
        "message": "Posting status updated",
        "posting_enabled": current_user.auto_post_enabled
    }