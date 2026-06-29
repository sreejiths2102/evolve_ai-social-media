from datetime import datetime
from sqlalchemy import (String,ForeignKey,DateTime,Boolean)
from sqlalchemy.orm import (Mapped, mapped_column)
from app.database.database import Base


class Notification(Base):
    __tablename__="notifications"
    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    actor_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    type: Mapped[str] = mapped_column(
        String
    )

    reference_id: Mapped[int | None] = mapped_column(
        nullable=True
    )

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )