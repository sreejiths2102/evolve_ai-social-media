from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.follow import Follow
from app.models.user import User
from app.services.auth_service import get_current_user
from app.services.notification_service import create_notification


router=APIRouter(
    prefix="/follow",
    tags=["Follow"]
)

@router.post("/{username}")
def follow_user(
    username:str,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    target_user=(
        db.query(User)
        .filter(User.username==username)
        .first()
    )
    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="user Not Found"
        )
    if target_user.id==current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot follow yourself"
        )
    existing_follow=(
        db.query(Follow)
        .filter(
            Follow.follower_id==current_user.id,
            Follow.following_id==target_user.id
        )
        .first()
    )
    if existing_follow:
        return{
            "message":"Already Following"
        }
    follow=Follow(
        follower_id=current_user.id,
        following_id=target_user.id
    )
    db.add(follow)
    db.commit()
    create_notification(
    db=db,
    user_id=target_user.id,
    actor_id=current_user.id,
    notification_type="follow"
)
    return{
        "message":f"Following {username}"
    }


@router.delete("/{username}")
def unfollow_user(
    username:str,
    db: Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    target_user=(
        db.query(User)
        .filter(User.username==username)
        .first()
    )
    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    follow=(
        db.query(Follow)
        .filter(
            Follow.follower_id==current_user.id,
            Follow.following_id==target_user.id
        )
        .first()   
    )
    if not follow:
        raise HTTPException(
            status_code=404,
            detail="Not following"
        )
    db.delete(follow)
    db.commit()
    return{
        "message":f"Unfollowed {username}"
    }


@router.get("/following")
def get_following(
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    follows=(
        db.query(Follow)
        .filter(
            Follow.follower_id==current_user.id
        )
        .all()
    )
    result=[]
    for follow in follows:
        user=(
            db.query(User)
            .filter(
                User.id==follow.following_id
            )
            .first()
        )
        if not user:
            continue
        result.append({
            "username":user.username,
            "character_name":user.character_name
        })

    return result    