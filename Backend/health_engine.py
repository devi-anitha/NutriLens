import json
import os

# Load health rules JSON once
RULES_PATH = "health_rules.json"

with open(RULES_PATH, "r", encoding="utf-8") as f:
    HEALTH_RULES = json.load(f)


def analyze_health_rules(
    health_issues: list,
    meal_type: str,
    ingredients: list,
    nutrients: dict
):
    """
    Returns personalized health advice based on:
    - health issues
    - meal type
    - foods eaten
    - nutrient values
    """

    avoid = set()
    recommend = set()
    notes = []

    # Normalize ingredient names
    food_names = [i["name"].lower() for i in ingredients]

    for issue in health_issues:
        key = issue.lower().replace(" ", "_")

        if key not in HEALTH_RULES:
            continue

        rule = HEALTH_RULES[key]

        # Avoid foods
        for a in rule.get("avoid", []):
            for food in food_names:
                if a.lower() in food:
                    avoid.add(a)

        # Recommendations
        for r in rule.get("recommend", []):
            recommend.add(r)

        # Notes
        if "notes" in rule:
            notes.append(rule["notes"])

    # 🕒 Time-based advice
    if meal_type == "Breakfast":
        notes.append("Breakfast should provide energy but remain light.")
    elif meal_type == "Lunch":
        notes.append("Lunch should be a balanced meal.")
    elif meal_type == "Evening Snack":
        notes.append("Snacks should be low-calorie and light.")
    elif meal_type == "Dinner":
        notes.append("Dinner should be light and low in carbohydrates.")

    # 🔢 Nutrient-based hints
    if nutrients.get("Carbs", 0) > 80:
        notes.append("Carbohydrate intake is high; reduce portion size.")

    if nutrients.get("Protein", 0) < 15:
        notes.append("Protein intake is low; consider adding protein-rich foods.")

    return {
        "avoid": list(avoid),
        "recommend": list(recommend),
        "notes": notes
    }
