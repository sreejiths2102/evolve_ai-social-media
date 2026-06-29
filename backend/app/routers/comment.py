from fastapi import (APIRouter,Depends,HTTPException)
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.post import Post
from app.models.user import User
from app.schemas.comment import (CommentCreate)
from app.services.auth_service import (get_current_user)
from app.models.comment import Comment
from app.services.notification_service import create_notification

router=APIRouter(
    prefix="/comments",
    tags=["Comments"]
)

@router.post("/{post_id}")
def add_comment(
    post_id:int,
    request:CommentCreate,
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
    comment=Comment(
        content=request.content,
        user_id=current_user.id,
        post_id=post_id
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    create_notification(
    db=db,
    user_id=post.user_id,
    actor_id=current_user.id,
    notification_type="comment",
    reference_id=post.id
)

    return{
        "message":"Comment added"
    }


@router.get("/{post_id}")
def get_comments(
    post_id:int,
    db:Session=Depends(get_db)
):
    comments=(
        db.query(Comment)
        .filter(
            Comment.post_id == post_id
        )
        .order_by(
            Comment.created_at.asc()
        )
        .all()
    )
    return [
        {
            "content": comment.content,
            "username":
                comment.user.username,
            "character_name":
                comment.user.character_name
        }
        for comment in comments
    ]