# utils.py  (FINAL – STABLE, SAFE & INDIAN-FOOD FRIENDLY)

import pandas as pd
from thefuzz import process

# -------------------- LOAD DATASET --------------------
DATA_PATH = "ingredients_dataset.csv"
_df = pd.read_csv(DATA_PATH)
_df.columns = [c.strip() for c in _df.columns]

# Detect food column
if "food" in _df.columns:
    FOOD_COL = "food"
else:
    FOOD_COL = [c for c in _df.columns if "food" in c.lower() or "name" in c.lower()][0]

_df["__food_lc"] = _df[FOOD_COL].astype(str).str.lower().str.strip()

# -------------------- NUTRIENT COLUMNS --------------------
def _find_col(*keys):
    for k in keys:
        for col in _df.columns:
            if k.lower() in col.lower():
                return col
    return None

COL_CAL  = _find_col("caloric", "energy", "kcal")
COL_PROT = _find_col("protein")
COL_FAT  = _find_col("fat")
COL_CARB = _find_col("carbohydrate", "carb")

# -------------------- UNIT CONVERSION --------------------
UNIT_TO_GRAMS = {
    "g": 1, "gram": 1,
    "kg": 1000,
    "mg": 0.001,
    "ml": 1,
    "l": 1000,
    "cup": 240,
    "spoon": 15,
    "tablespoon": 15,
    "teaspoon": 5,
    "piece": None
}

PIECE_WEIGHTS = {
    "egg": 50,
    "apple": 182,
    "banana": 118,
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
        return qty * 100  # safe fallback

    return qty  # assume grams

# -------------------- MATCHING LOGIC --------------------
EXCLUDE_COMPLEX = "fried|dessert|pizza|burger|cake|pastry"

def find_best_match(food_name):
    food = food_name.lower().strip()

    # 1️⃣ Exact match
    exact = _df[_df["__food_lc"] == food]
    if not exact.empty:
        row = exact.iloc[0]
        return row, [{"match": row[FOOD_COL], "score": 100}]

    # 2️⃣ Simple contains match (safe regex)
    contains = _df[
        (_df["__food_lc"].str.contains(food, regex=False)) &
        (~_df["__food_lc"].str.contains(EXCLUDE_COMPLEX, regex=True))
    ]

    if not contains.empty:
        row = contains.iloc[0]
        return row, [{"match": row[FOOD_COL], "score": 95}]

    # 3️⃣ Fuzzy match fallback
    choices = _df["__food_lc"].tolist()
    fuzzy = process.extract(food, choices, limit=5)
    fuzzy = [(m, s) for m, s in fuzzy if s >= 80]

    if not fuzzy:
        return None, [{"match": "No close match found", "score": 0}]

    best_name, score = fuzzy[0]
    best_row = _df[_df["__food_lc"] == best_name].iloc[0]

    suggestions = [
        {"match": _df[_df["__food_lc"] == m][FOOD_COL].iloc[0], "score": s}
        for m, s in fuzzy[:3]
    ]

    return best_row, suggestions

# -------------------- NUTRIENT CALCULATION --------------------
def get_val(row, col):
    try:
        return float(row[col]) if col else 0.0
    except:
        return 0.0

def scale(row, grams):
    factor = grams / 100.0
    return {
        "Calories": round(get_val(row, COL_CAL) * factor, 2),
        "Protein":  round(get_val(row, COL_PROT) * factor, 2),
        "Fat":      round(get_val(row, COL_FAT) * factor, 2),
        "Carbs":    round(get_val(row, COL_CARB) * factor, 2),
    }

# -------------------- MAIN FUNCTION --------------------
def calculate_total_nutrients(ingredients):
    total = {"Calories": 0, "Protein": 0, "Fat": 0, "Carbs": 0}
    suggestions = {}

    for item in ingredients:
        name = item["name"].strip()
        qty = float(item["quantity"])
        unit = item.get("unit", "g")

        grams = quantity_to_grams(name, qty, unit)
        row, sugg = find_best_match(name)

        if row is None:
            suggestions[name] = sugg
            continue

        scaled = scale(row, grams)
        for k in total:
            total[k] += scaled[k]

        suggestions[name] = sugg

    total = {k: round(v, 2) for k, v in total.items()}
    return {"total_nutrients": total, "suggestions": suggestions}
