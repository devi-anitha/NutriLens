def nutrient_analysis(nutrients):
    warnings = []
    benefits = []

    if nutrients.get("calories", 0) > 600:
        warnings.append("High calorie intake.")

    if nutrients.get("carbs", 0) > 60:
        warnings.append("High carbohydrate content.")

    if nutrients.get("protein", 0) >= 20:
        benefits.append("Good protein intake.")

    return warnings, benefits
