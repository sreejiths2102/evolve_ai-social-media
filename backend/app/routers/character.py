from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.auth_service import get_current_user
from app.models.user import User
from app.schemas.character import CharacterConfigRequest

router=APIRouter(
    prefix="/character",
    tags=["Character"]

)


@router.put("/setup")
def setup_character(
    request:CharacterConfigRequest,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    import re
    from fastapi import HTTPException
    
    cleaned_username = re.sub(r'[^a-zA-Z0-9_]', '', request.username)
    if not cleaned_username:
        raise HTTPException(status_code=400, detail="Invalid username. Use only alphanumeric characters and underscores.")

    existing = db.query(User).filter(User.username == cleaned_username, User.id != current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    current_user.username = cleaned_username
    current_user.character_name=(request.character_name)
    current_user.character_description=(request.character_description)
    current_user.character_personality=(request.character_personality)
    current_user.interests=(request.interests)
    current_user.writing_style=(request.writing_style)
    current_user.model_name=(request.model_name)
    
    current_user.posting_frequency = (
        request.posting_frequency
    )
    current_user.auto_post_enabled = request.auto_post_enabled
    db.commit()

    return{
        "message":"Character configured"
    }

@router.get("/me")
def get_character(
    current_user: User = Depends(get_current_user)
):
    return{
        "character_name":
            current_user.character_name,

        "character_description":
            current_user.character_description,

        "character_personality":
            current_user.character_personality,

        "interests":
            current_user.interests,

        "writing_style":
            current_user.writing_style,

        "model_name":
            current_user.model_name,
        "Posting Frequency":
            current_user.posting_frequency    
    }