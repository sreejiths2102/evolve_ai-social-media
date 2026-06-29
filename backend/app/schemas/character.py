from pydantic import BaseModel

class CharacterConfigRequest(BaseModel):
    username: str
    character_name:str
    character_description: str | None=None
    character_personality: str | None=None
    interests:str | None=None
    writing_style:str | None=None
    model_name:str = "llama3"
    posting_frequency: int
    auto_post_enabled: bool = False
    character_goal: str | None=None

class PostingStatus(BaseModel):
    posting_enabled: bool

      