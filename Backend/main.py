# main.py  (PHASE 1 – CLEAN & STABLE)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from utils import calculate_total_nutrients

# -------------------- FastAPI Setup --------------------
app = FastAPI(
    title="NutriLens API",
    description="Nutrition Analysis Backend (Phase 1)",
    version="1.0"
)

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Data Models --------------------
class Ingredient(BaseModel):
    name: str
    quantity: float
    unit: Optional[str] = "g"

class IngredientsRequest(BaseModel):
    ingredients: List[Ingredient]

# -------------------- Routes --------------------
@app.get("/")
def root():
    return {
        "message": "NutriLens Backend is running ✅",
        "available_endpoints": [
            "/calculate-nutrients"
        ]
    }

@app.post("/calculate-nutrients")
def calculate_nutrients(data: IngredientsRequest):
    """
    Calculates total nutrients from ingredient list.
    No AI. No Voice. Offline.
    """
    ingredients_list = [i.dict() for i in data.ingredients]
    result = calculate_total_nutrients(ingredients_list)

    return {
        "status": "success",
        "analysis_type": "nutrient_only",
        "data": result
    }

# -------------------- Run Server --------------------
# Start with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
