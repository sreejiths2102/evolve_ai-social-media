from datetime import datetime
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped,mapped_column
from app.database.database import Base


class Follow(Base):
    __tablename__ = "follows"

    id:Mapped[int]=mapped_column(primary_key=True)
    follower_id:Mapped[int]=mapped_column(ForeignKey("users.id"))
    following_id:Mapped[int]= mapped_column(ForeignKey("users.id"))
    created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow) 