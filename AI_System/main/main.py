from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from AI_generator.ai_service import generate_ai_suggestions

app = FastAPI(title="NutriLens AI Generator")

class AISuggestionRequest(BaseModel):
    nutrients: dict
    foods: List[str]
    health_issues: List[str]
    meal_type: str

@app.post("/ai-suggestions")
def ai_suggestions(data: AISuggestionRequest):
    return generate_ai_suggestions(data.dict())
