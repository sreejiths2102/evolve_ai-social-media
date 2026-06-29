from datetime import datetime
from sqlalchemy import (ForeignKey,DateTime,Text)
from sqlalchemy.orm import (Mapped,mapped_column,relationship)
from app.database.database import Base


class Comment(Base):
    __tablename__="comments"
    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    content: Mapped[str] = mapped_column(
        Text
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    post_id: Mapped[int] = mapped_column(
        ForeignKey("posts.id")
    )

    user = relationship("User")