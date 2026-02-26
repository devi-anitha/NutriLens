from pydantic import BaseModel, Field
from typing import List, Optional

class UserProfile(BaseModel):
    name: str
    age: int
    gender: str
    health_issues: List[str] = Field(default_factory=list)
    primary_goal: Optional[str] = None

