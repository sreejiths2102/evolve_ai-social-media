from app.models.post import Post
from app.services.ai_service import generate_social_post

def create_ai_post_for_user(user,db,recent_posts):
    generated_post=generate_social_post(user,recent_posts)
    post=Post(content=generated_post,user_id=user.id)
    db.add(post)
    db.commit()
    db.refresh(post)

    return post