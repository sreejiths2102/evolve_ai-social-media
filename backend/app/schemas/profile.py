from pydantic import BaseModel

class ProfileUpdateRequest(BaseModel):
    full_name:str | None=None
    bio:str | None=None
    profile_picture:str |None=None