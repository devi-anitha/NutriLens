import json
import os

from AI_generator.rule_engine import apply_health_rules
from AI_generator.nutrient_logic import nutrient_analysis
from AI_generator.formatter import format_message

BASE_DIR = os.path.dirname(__file__)
TIME_RULES_PATH = os.path.join(BASE_DIR, "time_rules.json")

with open(TIME_RULES_PATH, "r", encoding="utf-8") as f:
    TIME_RULES = json.load(f)

def generate_ai_suggestions(payload: dict):
    health_issues = payload["health_issues"]
    foods = payload["foods"]
    nutrients = payload["nutrients"]
    meal_type = payload["meal_type"]

    nutrient_warnings, benefits = nutrient_analysis(nutrients)
    rule_warnings, recommendations = apply_health_rules(health_issues, foods)

    summary = f"{meal_type.capitalize()} analyzed. {TIME_RULES.get(meal_type, '')}"

    return format_message(
        summary,
        nutrient_warnings + rule_warnings,
        benefits,
        recommendations
    )
