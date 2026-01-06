import pandas as pd

# Step 1: Load your combined dataset
file_path = r"E:\NutriLens\Backend\ingredients_dataset.csv"
df = pd.read_csv(file_path)

# Step 2: Reset continuous numbering
df.reset_index(drop=True, inplace=True)
df.index = df.index + 1  # optional: start numbering from 1 instead of 0

# If your dataset has an "id" or similar first column that should be updated:
if df.columns[0].lower() in ['id', 'index', 'no', 'number']:
    df[df.columns[0]] = range(1, len(df) + 1)

# Step 3: Save as new clean version
output_path = r"E:\NutriLens\Backend\ingredients_dataset_fixed.csv"
df.to_csv(output_path, index=False)

print(f"✅ Fixed dataset saved successfully as: {output_path}")
print(f"Total rows: {len(df)}")
