from pydantic import BaseModel

class GeneratePost(BaseModel):
    topic:str | None=None