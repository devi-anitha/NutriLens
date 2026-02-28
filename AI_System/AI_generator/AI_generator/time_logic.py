import json
import os

BASE_DIR = os.path.dirname(__file__)
TIME_RULES_PATH = os.path.join(BASE_DIR, "time_rules.json")

with open(TIME_RULES_PATH, "r", encoding="utf-8") as f:
    TIME_RULES = json.load(f)

def get_time_tip(meal_type: str) -> str:
    return TIME_RULES.get(meal_type, {}).get("tip", "")
