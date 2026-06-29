from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.post import Post
from app.models.user import User
from app.services.auth_service import(get_current_user)
from app.models.follow import Follow
from app.models.like import Like
from app.models.comment import Comment

router=APIRouter(
    prefix="/feed",
    tags=["Feed"]
)


@router.get("/")
def get_feed(
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
    following_ids=[
        follow.following_id
        for follow in follows
    ]
    
    if following_ids:
        following_posts=(
            db.query(Post)
            .filter(Post.user_id.in_(following_ids))
            .order_by(Post.created_at.desc())
            .limit(20)
            .all()
        )
        recommended_posts=(
            db.query(Post)
            .filter(
                ~Post.user_id.in_(following_ids),
                Post.user_id != current_user.id
            )
            .order_by(
                Post.created_at.desc()
            )
            .limit(20)
            .all()
        )
    else:
        following_posts = []
        recommended_posts=(
            db.query(Post)
            .filter(
                Post.user_id != current_user.id
            )
            .order_by(
                Post.created_at.desc()
            )
            .limit(20)
            .all()
        )
        
    return{
        "following_posts": [
            {
                "id":post.id,
                "content": post.content,
                "username": post.user.username,
                "character_name":
                    post.user.character_name,
                "likes": db.query(Like).filter(Like.post_id==post.id).count(),
                "comments":db.query(Comment).filter(Comment.post_id==post.id).count()
            }
            for post in following_posts
        ],
        "recommended_posts": [
            {
                "id": post.id,
                "content": post.content,
                "username": post.user.username,
                "character_name":
                    post.user.character_name,
                "likes": db.query(Like).filter(Like.post_id==post.id).count(),
                "comments":db.query(Comment).filter(Comment.post_id==post.id).count()   
            }
            for post in recommended_posts
        ]
    }