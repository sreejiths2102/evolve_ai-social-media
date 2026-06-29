from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta

from app.database.database import SessionLocal
from app.models.user import User
from app.models.post import Post

from app.services.post_service import (
    create_ai_post_for_user
)

scheduler = BackgroundScheduler()


def should_post(user):

    if not user.auto_post_enabled:
        return False

    if user.last_auto_post_at is None:
        return True

    return (
        datetime.utcnow()
        - user.last_auto_post_at
    ) >= timedelta(
        days=user.posting_frequency
    )


def auto_post_job():

    print("Running auto post job...")

    db = SessionLocal()

    try:

        users = db.query(User).all()

        for user in users:

            if not should_post(user):
                continue

            print(
                f"Generating post for {user.username}"
            )

            recent_posts = (
                db.query(Post)
                .filter(
                    Post.user_id == user.id
                )
                .order_by(
                    Post.created_at.desc()
                )
                .limit(5)
                .all()
            )

            create_ai_post_for_user(
                user=user,
                db=db,
                recent_posts=recent_posts
            )

            user.last_auto_post_at = (
                datetime.utcnow()
            )

            db.commit()

    except Exception as e:

        print(
            f"Scheduler error: {e}"
        )

    finally:

        db.close()


def start_scheduler():

    scheduler.add_job(
        auto_post_job,
        trigger="interval",
        minutes=60
    )

    scheduler.start()

    print("Scheduler started")