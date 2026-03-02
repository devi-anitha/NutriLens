import os
from dotenv import load_dotenv

# -------------------- LOAD ENV --------------------
load_dotenv()  # Automatically loads Backend/.env

GROQ_KEY = os.getenv("GROQ_API_KEY")
print("🔑 GROQ KEY LOADED:", bool(GROQ_KEY))


def generate_ai_advice(
    nutrients: dict,
    meal_type: str,
    health_issues: list,
    primary_goal: str,
    age: int
):
    """
    Hybrid AI generator (Groq + Safe Rule Fallback)
    """

    # -------------------- NO KEY → RULE FALLBACK --------------------
    if not GROQ_KEY:
        return (
            "AI is not configured. Health rules were used to generate "
            "safe dietary recommendations."
        )

    try:
        print("🔥 Calling Groq API...")

        from groq import Groq
        client = Groq(api_key=GROQ_KEY)

        prompt = f"""
You are a friendly nutrition assistant.

User details:
- Age: {age}
- Health issues: {health_issues}
- Goal: {primary_goal}
- Meal type: {meal_type}

Meal nutrients:
Calories: {nutrients.get("Calories")}
Protein: {nutrients.get("Protein")}
Fat: {nutrients.get("Fat")}
Carbs: {nutrients.get("Carbs")}

Tasks:
• Explain benefits
• Warn if risky
• Suggest improvements
• Keep it short & voice-friendly (5–6 lines)
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a nutrition expert."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.4,
        )

        ai_text = response.choices[0].message.content.strip()
        print("✅ Groq response received")

        return ai_text

    except Exception as e:
        print("❌ Groq Error:", e)

        # -------------------- FAILSAFE --------------------
        return (
            "AI analysis failed temporarily. "
            "Health rules were applied to ensure safe recommendations."
        )
    