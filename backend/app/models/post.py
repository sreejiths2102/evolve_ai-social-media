from datetime import datetime

from sqlalchemy import (Text,ForeignKey,DateTime)
from sqlalchemy.orm import(Mapped,mapped_column)
from app.database.database import Base
from sqlalchemy.orm import relationship

class Post(Base):
    __tablename__="posts"
    user=relationship("User")
    id:Mapped[int]=mapped_column(primary_key=True)
    content:Mapped[str]=mapped_column(Text)

    created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)
    user_id:Mapped[int]=mapped_column(ForeignKey("users.id"))