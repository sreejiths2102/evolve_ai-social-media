from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os

load_dotenv()
SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_context=CryptContext(
    schemes=["pbkdf2_sha256", "bcrypt"],
    deprecated="auto"
)
def hash_password(password:str):
    return pwd_context.hash(password)
def verify_password(
        plain_password:str,
        hashed_password:str
):
    return pwd_context.verify(plain_password,hashed_password)

def create_access_token(data:dict):
    to_encode=data.copy()
    expire=datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({
        "exp":expire
    })
    secret_key=SECRET_KEY
    algorithm=ALGORITHM
    if secret_key is None or algorithm is None:
        raise ValueError("SECRET_KEY and ALGORITHM must be set")
    return jwt.encode(
        to_encode,
        secret_key,
        algorithm=algorithm
    )