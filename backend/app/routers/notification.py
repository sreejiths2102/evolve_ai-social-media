from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.notification import Notification
from app.models.user import User
from app.services.auth_service import get_current_user


router=APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/")
def get_notifications(
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    results=(
        db.query(Notification, User.username, User.character_name)
        .join(User, User.id == Notification.actor_id)
        .filter(
            Notification.user_id==current_user.id
        )
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [
        {
            "id": n.id,
            "user_id": n.user_id,
            "actor_id": n.actor_id,
            "actor_username": username,
            "actor_character_name": character_name,
            "type": n.type,
            "reference_id": n.reference_id,
            "is_read": n.is_read,
            "created_at": n.created_at
        }
        for n, username, character_name in results
    ]


@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id:int,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    notification=(
        db.query(Notification)
        .filter(
            Notification.id==notification_id,
            Notification.user_id==current_user.id
        )
        .first()
    )
    if notification:
        notification.is_read=True
        db.commit()

    return{
        "message":"Notification updated"
    }    