import json
import os

BASE_DIR = os.path.dirname(__file__)
RULES_PATH = os.path.join(BASE_DIR, "health_rules.json")

with open(RULES_PATH, "r", encoding="utf-8") as f:
    HEALTH_RULES = json.load(f)

def apply_health_rules(health_issues, foods):
    warnings = []
    recommendations = []

    for issue in health_issues:
        rules = HEALTH_RULES.get(issue.lower())
        if not rules:
            continue

        for avoid in rules.get("avoid", []):
            for food in foods:
                if avoid in food.lower():
                    warnings.append(f"Avoid {food} due to {issue}")

        recommendations.extend(rules.get("recommend", []))

    return list(set(warnings)), list(set(recommendations))
