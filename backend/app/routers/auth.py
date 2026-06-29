from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends

from app.schemas.auth import RegisterRequest
from app.schemas.auth import LoginRequest
from app.database.database import get_db
from app.models.user import User
from app.core.security import hash_password
from app.core.security import (verify_password, create_access_token)
from app.services.auth_service import get_current_user
router=APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
@router.post("/register")
def register(
    request:RegisterRequest,
    db:Session = Depends(get_db)
):
    existing_user=db.query(User).filter(
        User.email==request.email
    ).first()
    if existing_user:
        return{
            "message":"Email already exists"
        }

    # Generate unique username from email
    import re
    base_username = request.email.split("@")[0]
    base_username = re.sub(r'[^a-zA-Z0-9_]', '', base_username)
    if not base_username:
        base_username = "user"

    username = base_username
    counter = 1
    while db.query(User).filter(User.username == username).first():
        username = f"{base_username}{counter}"
        counter += 1

    user=User(
        username=username,
        email=request.email,
        password=hash_password(request.password)
    )


    db.add(user)
    db.commit()
    db.refresh(user)

    return{
        "message":"User registered Successfully"
    }


@router.post("/login")
def login(
    request:LoginRequest,
    db:Session=Depends(get_db)
):
    user=db.query(User).filter(
        User.email==request.email
    ).first()
    if not user:
        return{"message":"Invalid Credentials"}
    if not verify_password(
        request.password,
        str(user.password)
    ):
        return{
            "message":"Invalid Credentials"
        }
    token=create_access_token(
        {
            "sub":user.email 
        }
    )
    return{
        "access_token":token,
        "token_type":"bearer"
    }


@router.get("/me")
def get_me(
    current_user : User=Depends(
        get_current_user
    )
):
    return{
        "id":current_user.id,
        "username":current_user.username,
        "email" :current_user.email
    }