from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.database.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    username: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False
    )

    password: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    full_name: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    bio: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    profile_picture: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    cover_picture: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    character_name: Mapped[str | None]=mapped_column(
        String,
        nullable=True
    )
    character_description: Mapped[str | None]=mapped_column(
        Text,
        nullable=True
    )
    character_personality: Mapped[str | None]=mapped_column(
        Text,
        nullable=True
    )
    interests: Mapped[str | None]=mapped_column(
        Text,
        nullable=True
    )

    writing_style: Mapped[str | None]=mapped_column(
        String,
        nullable=True
    )    
    model_name: Mapped[str | None]=mapped_column(
        String,
        nullable=True,
        default="llama3"
    )
    character_goal: Mapped[str | None] = mapped_column(
    Text,
    nullable=True
    )
    posting_frequency: Mapped[int] = mapped_column(
    default=1
)

    auto_post_enabled: Mapped[bool] = mapped_column(
        default=False
    )

    last_auto_post_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )