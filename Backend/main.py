from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

from utils import calculate_total_nutrients
from models import UserProfile
from database import create_user_table, get_connection
from health_engine import analyze_health_rules
from ai_engine import generate_ai_advice

# -------------------- INIT --------------------
create_user_table()

app = FastAPI(
    title="NutriLens API",
    description="AI-Enabled Nutrition Analysis Backend",
    version="6.0 (PRODUCTION READY)"
)

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- DATA MODELS --------------------
class Ingredient(BaseModel):
    name: str
    quantity: float
    unit: Optional[str] = "g"

class IngredientsRequest(BaseModel):
    ingredients: List[Ingredient]

# -------------------- MEAL TYPE --------------------
def detect_meal_type():
    hour = datetime.now().hour
    if 5 <= hour < 11:
        return "Breakfast"
    elif 11 <= hour < 16:
        return "Lunch"
    elif 16 <= hour < 19:
        return "Evening Snack"
    else:
        return "Dinner"

# -------------------- ROOT --------------------
@app.get("/")
def root():
    return {
        "message": "NutriLens Backend Running ✅",
        "status": "AI + Rules Hybrid Enabled"
    }

# -------------------- USER PROFILE --------------------
@app.post("/user/profile")
def create_profile(profile: UserProfile):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO user_profile (name, age, gender, health_issues, primary_goal)
            VALUES (?, ?, ?, ?, ?)
        """, (
            profile.name,
            profile.age,
            profile.gender,
            json.dumps(profile.health_issues),
            profile.primary_goal
        ))

        conn.commit()
        conn.close()

        return {"message": "User profile created successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/user/profile")
def get_profile():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_profile ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="No profile found")

    return {
        "name": row[1],
        "age": row[2],
        "gender": row[3],
        "health_issues": json.loads(row[4]),
        "primary_goal": row[5]
    }

# -------------------- NUTRIENTS ONLY --------------------
@app.post("/calculate-nutrients")
def calculate_nutrients(data: IngredientsRequest):
    ingredients = [i.dict() for i in data.ingredients]
    return calculate_total_nutrients(ingredients)

# -------------------- MEAL LOGGING (Temporary In-Memory) --------------------
MEAL_HISTORY = []

@app.post("/meal/log")
def log_meal(data: IngredientsRequest):
    ingredients = [i.dict() for i in data.ingredients]
    nutrient_result = calculate_total_nutrients(ingredients)

    entry = {
        "time": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "meal_type": detect_meal_type(),
        "ingredients": ingredients,
        "nutrients": nutrient_result["total_nutrients"]
    }

    MEAL_HISTORY.append(entry)
    return {"message": "Meal logged successfully 🍽️", "data": entry}

@app.get("/meal/history")
def meal_history():
    return {
        "total_meals": len(MEAL_HISTORY),
        "meals": MEAL_HISTORY
    }

# -------------------- AI + RULE ENGINE --------------------
@app.post("/analyze-meal")
def analyze_meal(data: IngredientsRequest):
    ingredients = [i.dict() for i in data.ingredients]

    nutrient_result = calculate_total_nutrients(ingredients)
    nutrients = nutrient_result["total_nutrients"]
    meal_type = detect_meal_type()

    # Fetch latest user profile
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_profile ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="User profile not found")

    user_profile = {
        "name": row[1],
        "age": row[2],
        "gender": row[3],
        "health_issues": json.loads(row[4]),
        "primary_goal": row[5]
    }

    # Rule-based analysis
    health_analysis = analyze_health_rules(
        health_issues=user_profile["health_issues"],
        meal_type=meal_type,
        ingredients=ingredients,
        nutrients=nutrients
    )

    # AI analysis
    ai_message = generate_ai_advice(
        nutrients=nutrients,
        meal_type=meal_type,
        health_issues=user_profile["health_issues"],
        primary_goal=user_profile["primary_goal"],
        age=user_profile["age"]
    )

    # Hybrid fallback if AI fails
    if not ai_message or len(ai_message.strip()) < 10:
        ai_message = (
            f"This {meal_type.lower()} meal was analyzed using health rules. "
            f"Recommended foods include: {', '.join(health_analysis.get('recommend', []))}. "
            f"{' '.join(health_analysis.get('notes', []))}"
        )

    return {
        "user_profile": user_profile,
        "meal_type": meal_type,
        "nutrients": nutrients,
        "health_analysis": health_analysis,
        "recommendations": {
            "avoid": health_analysis.get("avoid", []),
            "add": health_analysis.get("recommend", [])
        },
        "ai_message": ai_message
    }


# -------------------- RUN --------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)