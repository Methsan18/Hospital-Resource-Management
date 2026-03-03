import os
import torch
from pytorch_forecasting import TemporalFusionTransformer

# 1. Load the Model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Model moved to Save_file/Bed
model_path = os.path.join(BASE_DIR, "Save_file", "Bed", "hospital_etu_tft_model_80split.ckpt")

print(f"🔍 Inspecting Model at: {model_path}...")

if os.path.exists(model_path):
    try:
        # Load model
        best_tft = TemporalFusionTransformer.load_from_checkpoint(model_path, map_location="cpu")
        print("\n✅ Model Loaded! Reading Vocabulary...")

        # 2. Print Allowed Categories
        encoders = best_tft.dataset_parameters["categorical_encoders"]
        
        # Check specific columns causing issues
        problem_cols = ["SpecialEvent", "IsHoliday", "PublicTransportStatus", "OutbreakAlert"]
        
        for col in problem_cols:
            if col in encoders:
                encoder = encoders[col]
                print(f"\n--- COLUMN: {col} ---")
                if hasattr(encoder, "classes_"):
                    # Print the first 10 allowed words
                    print(f"Allowed Words: {encoder.classes_}")
                else:
                    print("Numeric or unknown encoder type.")
            else:
                print(f"\n--- COLUMN: {col} ---")
                print("Not found in encoders (might be treated as continuous number?)")

    except Exception as e:
        print(f"❌ Error reading model: {e}")
else:
    print("❌ Model file not found.")