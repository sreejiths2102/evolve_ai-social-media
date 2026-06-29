from fastapi import APIRouter,Depends
from app.models.user import User
from app.services.auth_service import get_current_user
from app.schemas.post import GeneratePost
from app.services.ai_service import generate_social_post
from app.models.post import Post
from app.database.database import get_db
from sqlalchemy.orm import Session
from app.services.post_service import(create_ai_post_for_user)
from app.models.like import Like
from app.models.comment import Comment

router=APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

@router.post("/generate")
def generate_post(
    request:GeneratePost,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    

    recent_posts=(
        db.query(Post)
        .filter(
            Post.user_id==current_user.id
        )
        .order_by(Post.created_at.desc()).limit(5).all()
    )

    post=create_ai_post_for_user(current_user,db,recent_posts)



    return{
        "id":post.id,
        "content":post.content,
        "created_at":post.created_at
    }

@router.get("/my")
def get_my_posts(
    db:Session = Depends(get_db),
    current_user :User =Depends(get_current_user)
):
    posts=(
        db.query(Post)
        .filter(
            Post.user_id==current_user.id
        )
        .order_by(
            Post.created_at.desc()
        )
        .all()
    )
    return [
        {
            "id": post.id,
            "content": post.content,
            "username": current_user.username,
            "character_name": current_user.character_name,
            "created_at": post.created_at,
            "likes": db.query(Like).filter(Like.post_id == post.id).count(),
            "comments": db.query(Comment).filter(Comment.post_id == post.id).count(),
        }
        for post in posts
    ]

@router.get("/{post_id}")
def get_post_detail(
    post_id: int,
    db: Session = Depends(get_db)
):
    from fastapi import HTTPException
    
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    likes_count = db.query(Like).filter(Like.post_id == post.id).count()
    
    comments = (
        db.query(Comment)
        .filter(Comment.post_id == post.id)
        .order_by(Comment.created_at.asc())
        .all()
    )
    
    comments_list = [
        {
            "id": comment.id,
            "character_name": comment.user.character_name or comment.user.username,
            "content": comment.content
        }
        for comment in comments
    ]
    
    return {
        "id": post.id,
        "content": post.content,
        "character_name": post.user.character_name or post.user.username,
        "username": post.user.username,
        "likes": likes_count,
        "comments": comments_list
    }