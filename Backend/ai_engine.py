import os
from dotenv import load_dotenv

# -------------------- LOAD ENV --------------------
# Make sure this file is in Backend/openai_api_key.env
load_dotenv("openai_api_key.env")

OPENAI_KEY = os.getenv("OPENAI_API_KEY")
print("🔑 OPENAI KEY LOADED:", bool(OPENAI_KEY))


def generate_ai_advice(
    nutrients: dict,
    meal_type: str,
    health_issues: list,
    primary_goal: str,
    age: int
):
    """
    Safe AI generator with fallback (RULES → AI)
    """

    # -------------------- NO KEY → RULE FALLBACK --------------------
    if not OPENAI_KEY:
        return (
            "AI is not configured. Health rules were used to generate "
            "safe dietary recommendations."
        )

    try:
        print("🔥 Calling OpenAI API...")

        # ✅ Correct OpenAI client usage (new SDK)
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_KEY)

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
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a nutrition expert."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
        )

        ai_text = response.choices[0].message.content.strip()
        print("✅ OpenAI response received")

        return ai_text

    except Exception as e:
        print("❌ OpenAI Error:", e)

        # -------------------- FAILSAFE --------------------
        return (
            "AI analysis failed temporarily. "
            "Health rules were applied to ensure safe recommendations."
        )
