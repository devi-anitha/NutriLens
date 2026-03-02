export function analyzeFood(food, conditions) {
  const text = (food || "").toLowerCase();
  const warnings = [];
  const suggestions = [];
  const insights = [];

  let calories = 420;
  let protein = 18;
  let carbs = 50;
  let fat = 16;
  let fiber = 6;
  let sodium = 550;

  const has = (k) => text.includes(k);

  if (has("rice")) {
    carbs += 20;
    fiber -= 2;
    calories += 80;
    suggestions.push("Swap white rice for brown rice or millets");
  }
  if (has("biryani")) {
    fat += 10;
    sodium += 400;
    calories += 220;
    suggestions.push("Reduce biryani portion or choose grilled options");
  }
  if (has("salad")) {
    fiber += 4;
    calories -= 60;
    suggestions.push("Keep salads, add lean protein for balance");
  }
  if (has("egg")) {
    protein += 12;
    fat += 5;
  }
  if (has("fried") || has("deep-fried")) {
    fat += 8;
    calories += 120;
    suggestions.push("Prefer baked or grilled over fried");
  }
  if (has("soda") || has("soft drink") || has("sweet") || has("dessert") || has("sugar")) {
    carbs += 18;
    calories += 140;
    suggestions.push("Limit sugary drinks and desserts");
  }
  if (has("dal") || has("lentil")) {
    protein += 8;
    fiber += 3;
    suggestions.push("Great protein source; keep dal in meals");
  }
  if (has("roti")) {
    carbs += 12;
    fiber += 1;
  }
  if (has("pickle") || has("papad")) {
    sodium += 350;
    suggestions.push("Reduce pickle/papad to control sodium");
  }

  if (conditions.includes("Diabetes")) {
    if (carbs > 60 || has("rice") || has("sugar") || has("sweet")) {
      warnings.push("High carbs for diabetes; pair carbs with protein/fiber");
      suggestions.push("Add sprouts/egg/dal; include vegetables to slow glucose rise");
    }
  }
  if (conditions.includes("BP")) {
    if (sodium > 700 || has("biryani") || has("pickle")) {
      warnings.push("High sodium; not BP friendly");
      suggestions.push("Choose low-salt options and avoid pickle/papad");
    }
  }

  const carbProteinRatio = protein ? (carbs / protein) : carbs;
  if (carbProteinRatio > 3) {
    insights.push("Carb-heavy compared to protein");
    suggestions.push("Add lean protein (dal, eggs, tofu, grilled chicken)");
  }
  if (fat > 22) {
    insights.push("Fat is on the higher side");
    suggestions.push("Reduce oil; avoid deep-fried sides");
  }
  if (fiber < 5) {
    insights.push("Low fiber");
    suggestions.push("Include salads, vegetables, or whole grains");
  }
  if (calories > 600) {
    insights.push("Calorie-dense meal");
    suggestions.push("Consider portion control or add a low-calorie side");
  }

  if (sodium > 1000) {
    warnings.push("Very high sodium");
  } else if (sodium > 800) {
    warnings.push("High sodium");
  }
  if (fat > 25) {
    warnings.push("High fat");
  }
  if (carbs > 70) {
    warnings.push("High carbs");
  }
  if (calories > 700) {
    warnings.push("High calories");
  }

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sodium,
    warnings,
    suggestions: Array.from(new Set(suggestions)),
    insights: Array.from(new Set(insights)),
  };
}
