from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json
import math

from utils import calculate_total_nutrients
from models import UserProfile, UserSignup, UserLogin, OTPRequest, OTPVerify, PasswordReset
from database import create_user_table, get_connection
from health_engine import analyze_health_rules
from ai_engine import generate_ai_advice

import os
import smtplib
from email.mime.text import MIMEText
import random
from dotenv import load_dotenv
import sqlite3

load_dotenv()

# -------------------- INIT --------------------
create_user_table()

app = FastAPI(
    title="NutriLens API",
    description="AI-Enabled Nutrition Analysis Backend",
    version="FINAL STABLE"
)

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- MODELS --------------------
class Ingredient(BaseModel):
    name: str
    quantity: float
    unit: Optional[str] = "g"

class IngredientsRequest(BaseModel):
    user_id: Optional[int] = None
    ingredients: List[Ingredient]

# -------------------- HELPERS --------------------
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

# 🔥 FIX: safe value for NaN / None
def safe_value(val):
    if val is None:
        return 0
    if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
        return 0
    return val

# -------------------- ROOT --------------------
@app.get("/")
def root():
    return {"message": "NutriLens Backend Running ✅"}

# -------------------- OTP STORE --------------------
OTP_STORE = {}

# -------------------- AUTH --------------------
@app.post("/auth/signup")
def signup(data: UserSignup):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (name, mobile, email, password) VALUES (?, ?, ?, ?)",
            (data.name, data.mobile, data.email, data.password)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="User already exists")
    conn.close()
    return {"message": "User registered successfully"}

@app.post("/auth/login")
def login(data: UserLogin):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE (email=? OR mobile=? OR name=?) AND password=?",
        (data.identifier, data.identifier, data.identifier, data.password)
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "user": {"id": user[0], "name": user[1], "email": user[3]}
    }

# -------------------- OTP --------------------
@app.post("/auth/send-otp")
def send_otp(data: OTPRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT email FROM users WHERE email=? OR mobile=?",
        (data.identifier, data.identifier)
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_email = user[0]
    otp = str(random.randint(1000, 9999))
    OTP_STORE[data.identifier] = otp

    email_user = os.getenv("EMAIL_USER")
    email_pass = os.getenv("EMAIL_PASSWORD")

    try:
        msg = MIMEText(f"Your NutriLens OTP is: {otp}")
        msg["Subject"] = "NutriLens OTP"
        msg["From"] = email_user
        msg["To"] = user_email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(email_user, email_pass)
            server.sendmail(email_user, user_email, msg.as_string())

        print("✅ OTP sent:", otp)

    except Exception as e:
        print("❌ Email failed:", e)
        print("DEV MODE OTP:", otp)

    return {"message": "OTP sent"}

@app.post("/auth/verify-otp")
def verify_otp(data: OTPVerify):
    if OTP_STORE.get(data.identifier) != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    return {"message": "OTP verified"}

@app.post("/auth/reset-password")
def reset_password(data: PasswordReset):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE users SET password=? WHERE email=? OR mobile=?",
        (data.new_password, data.identifier, data.identifier)
    )

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    conn.commit()
    conn.close()

    OTP_STORE.pop(data.identifier, None)
    return {"message": "Password reset successful"}

# -------------------- PROFILE --------------------
@app.post("/user/profile")
def create_profile(profile: UserProfile):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO user_profile (user_id, name, age, gender, health_issues, primary_goal, height, weight, dob)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        profile.user_id,
        profile.name,
        profile.age,
        profile.gender,
        json.dumps(profile.health_issues or []),
        profile.primary_goal,
        profile.height,
        profile.weight,
        profile.dob
    ))

    conn.commit()
    conn.close()

    return {"message": "Profile saved"}

@app.get("/user/profile/{user_id}")
def get_profile(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, user_id, name, age, gender, health_issues, primary_goal, height, weight, dob FROM user_profile WHERE user_id=? ORDER BY id DESC LIMIT 1",
        (user_id,)
    )
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="No profile found")

    try:
        health_issues = json.loads(row[5]) if row[5] else []
    except:
        health_issues = []

    return {
        "user_id": row[1],
        "name": row[2],
        "age": row[3],
        "gender": row[4],
        "health_issues": health_issues,
        "primary_goal": row[6],
        "height": row[7] if len(row) > 7 else None,
        "weight": row[8] if len(row) > 8 else None,
        "dob": row[9] if len(row) > 9 else None
    }

# -------------------- MEAL HISTORY --------------------
@app.get("/meal/history/{user_id}")
def meal_history(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM meal_history WHERE user_id=? ORDER BY id DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return {"total_meals": 0, "meals": []}

    def clean_nan(value):
        import math
        if value is None:
            return 0
        if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
            return 0
        return value

    meals = []
    for row in rows:
        nutrients = json.loads(row[5])
        nutrients = {k: clean_nan(v) for k, v in nutrients.items()}

        health_analysis = json.loads(row[6]) if row[6] else {}
        if isinstance(health_analysis, dict):
            health_analysis = {k: clean_nan(v) for k, v in health_analysis.items()}

        meals.append({
            "id": row[0],
            "time": row[2],
            "meal_type": row[3],
            "ingredients": json.loads(row[4]),
            "nutrients": nutrients,
            "health_analysis": health_analysis,
            "recommendations": json.loads(row[7]) if row[7] else {},
            "ai_message": row[8]
        })

    return {"total_meals": len(meals), "meals": meals}

# -------------------- ANALYZE MEAL --------------------
# -------------------- ANALYZE MEAL --------------------
@app.post("/analyze-meal")
def analyze_meal(data: IngredientsRequest):
    print("USER ID RECEIVED:", data.user_id)
    if not data.user_id:
        raise HTTPException(status_code=400, detail="User ID missing")

    ingredients = [i.dict() for i in data.ingredients]

    nutrients = calculate_total_nutrients(ingredients)["total_nutrients"]

    # 🔥 FIX: remove NaN
    nutrients = {k: safe_value(v) for k, v in nutrients.items()}

    meal_type = detect_meal_type()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, user_id, name, age, gender, health_issues, primary_goal FROM user_profile WHERE user_id=? ORDER BY id DESC LIMIT 1",
        (data.user_id,)
    )
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="User profile not found")

    try:
        health_issues = json.loads(row[5]) if row[5] else []
    except:
        health_issues = []

    health_analysis = analyze_health_rules(
        health_issues,
        meal_type,
        ingredients,
        nutrients
    )

    # ---------------- AI GENERATION ----------------
    base_goal = f"{row[6] if row[6] else 'Healthy Living'}. Give response in English only. Do not translate. Do NOT cut off the answer."

    ai_message = generate_ai_advice(
        nutrients,
        meal_type,
        health_issues,
        base_goal,
        row[3]
    )

    if not ai_message:
        ai_message = "Basic health analysis completed."

    # ---------------- SAVE ----------------
    try:
        conn = get_connection()
        cursor = conn.cursor()
        print("USER ID:", data.user_id)
        cursor.execute("""
            INSERT INTO meal_history (user_id, time, meal_type, ingredients, nutrients, health_analysis, recommendations, ai_message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.user_id,
            datetime.now().strftime("%Y-%m-%d %H:%M"),
            meal_type,
            json.dumps(ingredients),
            json.dumps(nutrients),
            json.dumps(health_analysis),
            json.dumps({
                "avoid": health_analysis.get("avoid", []),
                "add": health_analysis.get("recommend", [])
            }),
            ai_message
        ))

        conn.commit()
        print("Meal saved successfully")
    except Exception as e:
        print("Error saving meal:", e)
    finally:
        if 'conn' in locals() and conn:
            conn.close()

    return {
        "meal_type": meal_type,
        "nutrients": nutrients,
        "health_analysis": health_analysis,
        "recommendations": {
            "add": health_analysis.get("recommend", []),
            "avoid": health_analysis.get("avoid", [])
        },
        "ai_message": ai_message
    }

# -------------------- RUN --------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True)