import pandas as pd

# Adjust the path if needed
data = pd.read_csv("ingredients_dataset.csv")
print("Columns in dataset:")
print(data.columns.tolist())
