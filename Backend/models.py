from pydantic import BaseModel, Field
from typing import List, Optional

class UserProfile(BaseModel):
    user_id: int
    name: str
    age: int
    gender: str
    health_issues: List[str] = Field(default_factory=list)
    primary_goal: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None

class UserSignup(BaseModel):
    name: str
    mobile: str
    email: str
    password: str

class UserLogin(BaseModel):
    identifier: str
    password: str

class OTPRequest(BaseModel):
    identifier: str

class OTPVerify(BaseModel):
    identifier: str
    otp: str

class PasswordReset(BaseModel):
    identifier: str
    new_password: str
