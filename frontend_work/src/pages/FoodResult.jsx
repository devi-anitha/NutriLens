import { analyzeFood } from "../utils/foodAnalysis";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/global.css";

export default function FoodResult() {
  const navigate = useNavigate();
  const food = localStorage.getItem("food") || "";
  const healthProfile = JSON.parse(localStorage.getItem("healthProfile")) || {};
  const conditions = healthProfile.conditions || [];

  const data = analyzeFood(food.toLowerCase(), conditions);

  useEffect(() => {
    if (!food || !food.trim()) {
      navigate("/dashboard");
    }
  }, [food, navigate]);

  return (
    <div
      className="page-container"
      style={{ background: "#ecfdf5", padding: "2rem" }}
    >
      <div
        className="card"
        style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}
      >
        <h1 style={{ marginBottom: "1.5rem" }}>Nutrition Analysis 🍎</h1>

        <div
          style={{
            background: "#f8fafc",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              color: "var(--gray)",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            You ate:
          </p>
          <h3 style={{ fontSize: "1.5rem", textTransform: "capitalize" }}>
            {food}
          </h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <StatBox label="Calories" value={data.calories} />
          <StatBox label="Protein" value={`${data.protein}g`} />
          <StatBox label="Carbs" value={`${data.carbs}g`} />
          <StatBox label="Fat" value={`${data.fat}g`} />
          <StatBox label="Fiber" value={`${data.fiber}g`} />
          <StatBox label="Sodium" value={`${data.sodium}mg`} />
        </div>

        {data.warnings.length > 0 ? (
          <div
            style={{
              background: "#fef2f2",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              border: "1px solid #fecaca",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                color: "#ef4444",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ⚠️ Health Warnings
            </h3>
            {data.warnings.map((w) => (
              <p
                key={w}
                style={{
                  color: "#b91c1c",
                  marginBottom: "0.5rem",
                  fontSize: "0.95rem",
                }}
              >
                • {w}
              </p>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "#f0fdf4",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              border: "1px solid #bbf7d0",
              color: "#15803d",
            }}
          >
            ✅ This meal looks safe for your conditions!
          </div>
        )}

        {data.suggestions?.length > 0 && (
          <div
            style={{
              background: "#eff6ff",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              border: "1px solid #bfdbfe",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                color: "#2563eb",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ✅ Suggestions
            </h3>
            {data.suggestions.map((s) => (
              <p
                key={s}
                style={{
                  color: "#1e40af",
                  marginBottom: "0.5rem",
                  fontSize: "0.95rem",
                }}
              >
                • {s}
              </p>
            ))}
          </div>
        )}

        {data.insights?.length > 0 && (
          <div
            style={{
              background: "#faf5ff",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              border: "1px solid #e9d5ff",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                color: "#7c3aed",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📊 Smart Insights
            </h3>
            {data.insights.map((i) => (
              <p
                key={i}
                style={{
                  color: "#5b21b6",
                  marginBottom: "0.5rem",
                  fontSize: "0.95rem",
                }}
              >
                • {i}
              </p>
            ))}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard")}
          style={{ width: "100%" }}
        >
          Scan Another Meal
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div
      style={{ background: "#f1f5f9", padding: "1rem", borderRadius: "10px" }}
    >
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--gray)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: "var(--dark)",
        }}
      >
        {value}
      </p>
    </div>
  );
}
