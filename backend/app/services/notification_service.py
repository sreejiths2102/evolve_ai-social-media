from app.models.notification import Notification

def create_notification(
        db,
        user_id,
        actor_id,
        notification_type,
        reference_id=None
):
    if user_id == actor_id:
        return None

    notification=Notification(
        user_id=user_id,
        actor_id=actor_id,
        type=notification_type,
        reference_id=reference_id
    )
    db.add(notification)
    db.commit()
    return notification