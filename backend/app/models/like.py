from datetime import datetime
from sqlalchemy import(ForeignKey,DateTime)
from sqlalchemy.orm import (Mapped,mapped_column)
from app.database.database import Base

class Like(Base):
    __tablename__="likes"
    id:Mapped[int]=mapped_column(primary_key=True)
    user_id:Mapped[int]=mapped_column(ForeignKey("users.id"))
    post_id:Mapped[int]=mapped_column(ForeignKey("posts.id"))
    created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)