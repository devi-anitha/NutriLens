# utils.py  (PHASE 1 – CLEAN & STABLE)

import pandas as pd
from thefuzz import process

# -------------------- DATA LOAD --------------------
DATA_PATH = "ingredients_dataset.csv"

_df = pd.read_csv(DATA_PATH)
_df.columns = [c.strip() for c in _df.columns]

# Detect food column
if "food" in _df.columns:
    FOOD_COL = "food"
else:
    possible = [c for c in _df.columns if "food" in c.lower() or "name" in c.lower()]
    FOOD_COL = possible[0]

_df["__food_lc"] = _df[FOOD_COL].astype(str).str.strip().str.lower()

# -------------------- NUTRIENT COLUMN DETECTION --------------------
def _find_col(*keywords):
    for k in keywords:
        for col in _df.columns:
            if k.lower() in col.lower():
                return col
    return None

COL_CAL  = _find_col("calorie", "energy", "kcal")
COL_PROT = _find_col("protein")
COL_FAT  = _find_col("fat")
COL_CARB = _find_col("carbohydrate", "carb")

# -------------------- UNIT CONVERSION --------------------
UNIT_TO_GRAMS = {
    "g": 1, "gram": 1, "grams": 1,
    "kg": 1000,
    "mg": 0.001,
    "ml": 1,
    "l": 1000, "litre": 1000, "liter": 1000,
    "cup": 240,
    "tablespoon": 15, "tbsp": 15,
    "teaspoon": 5, "tsp": 5,
    "spoon": 15,
    "slice": 30,
    "piece": None
}

PIECE_WEIGHTS = {
    "egg": 50,
    "apple": 182,
    "banana": 118,
    "orange": 131,
    "tomato": 123,
    "potato": 213
}

def quantity_to_grams(name, qty, unit):
    unit = (unit or "g").lower().strip()

    if unit in UNIT_TO_GRAMS and UNIT_TO_GRAMS[unit] is not None:
        return qty * UNIT_TO_GRAMS[unit]

    if unit == "piece":
        for k, v in PIECE_WEIGHTS.items():
            if k in name.lower():
                return qty * v
        return qty * 100  # fallback

    return qty  # assume grams

# -------------------- MATCHING --------------------
FUZZY_THRESHOLD = 70

def find_exact(food):
    row = _df[_df["__food_lc"] == food.lower()]
    return row.iloc[0] if not row.empty else None

def find_fuzzy(food):
    matches = process.extract(food, _df["__food_lc"].tolist(), limit=5)
    return [(m, s) for m, s in matches if s >= FUZZY_THRESHOLD]

# -------------------- SCALING --------------------
def get_value(row, col):
    try:
        return float(row[col]) if col else 0.0
    except:
        return 0.0

def scale_nutrients(row, grams):
    factor = grams / 100.0
    return {
        "Calories": round(get_value(row, COL_CAL) * factor, 2),
        "Protein":  round(get_value(row, COL_PROT) * factor, 2),
        "Fat":      round(get_value(row, COL_FAT) * factor, 2),
        "Carbs":    round(get_value(row, COL_CARB) * factor, 2),
    }

# -------------------- MAIN FUNCTION --------------------
def calculate_total_nutrients(ingredients):
    total = {"Calories": 0, "Protein": 0, "Fat": 0, "Carbs": 0}
    suggestions = {}

    for item in ingredients:
        name = item["name"].strip()
        qty  = float(item["quantity"])
        unit = item.get("unit", "g")

        exact = find_exact(name)
        grams = quantity_to_grams(name, qty, unit)

        if exact is not None:
            scaled = scale_nutrients(exact, grams)
            for k in total:
                total[k] += scaled[k]
            suggestions[name] = [{"match": exact[FOOD_COL], "score": 100}]
            continue

        fuzzy = find_fuzzy(name)
        if not fuzzy:
            suggestions[name] = []
            continue

        best_name, score = fuzzy[0]
        best_row = _df[_df["__food_lc"] == best_name].iloc[0]
        scaled = scale_nutrients(best_row, grams)

        for k in total:
            total[k] += scaled[k]

        suggestions[name] = [
            {"match": _df[_df["__food_lc"] == m][FOOD_COL].iloc[0], "score": s}
            for m, s in fuzzy[:3]
        ]

    total = {k: round(v, 2) for k, v in total.items()}
    return {"total_nutrients": total, "suggestions": suggestions}
