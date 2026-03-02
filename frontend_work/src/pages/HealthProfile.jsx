import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const CONDITIONS = [
  "Diabetes Type 1",
  "Diabetes Type 2",
  "High Blood Pressure",
  "Low Blood Pressure",
  "Heart Disease",
  "Asthma",
  "Thyroid",
  "Obesity",
  "Anemia",
  "High Cholesterol",
  "Kidney Disease",
  "Liver Disease",
  "Gastritis",
  "Acid Reflux (GERD)",
  "IBS",
  "Arthritis",
  "Osteoporosis",
  "Migraine",
  "Depression",
  "Anxiety",
  "Sleep Apnea",
  "PCOS",
  "Pregnancy",
  "Food Allergy",
  "Lactose Intolerance",
  "Celiac Disease",
  "Gout",
  "Stroke History",
  "Cancer History",
  "Hypertension",
  "Hypothyroidism",
  "Hyperthyroidism",
  "Vitamin D Deficiency",
  "Vitamin B12 Deficiency",
  "Smoking",
  "Alcohol Consumption",
  "Post Surgery Recovery",
];

export default function HealthProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
    conditions: [],
  });
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("healthProfile");
    if (saved) setForm(JSON.parse(saved));
  }, []);

  const filteredConditions = CONDITIONS.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  const addCondition = (condition) => {
    if (!form.conditions.includes(condition)) {
      setForm({ ...form, conditions: [...form.conditions, condition] });
    }
    setSearch("");
    setShowDropdown(false);
  };

  const removeCondition = (condition) => {
    setForm({
      ...form,
      conditions: form.conditions.filter((c) => c !== condition),
    });
  };

  const handleSave = () => {
    localStorage.setItem("healthProfile", JSON.stringify(form));
    localStorage.removeItem("isNewUser");
    navigate("/dashboard");
  };

  return (
    <div
      className="page-container"
      style={{ background: "#ecfdf5", paddingBottom: "2rem" }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "500px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "0.5rem",
            color: "var(--primary-dark)",
          }}
        >
          Health Profile 🩺
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--gray)",
            marginBottom: "2rem",
          }}
        >
          Tell us about yourself so we can personalize your analysis.
        </p>

        <div className="input-group">
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            Full Name
          </label>
          <input
            className="input-field"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div className="input-group">
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              Date of Birth
            </label>
            <input
              className="input-field"
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              Gender
            </label>
            <select
              className="input-field"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div className="input-group">
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              Height (cm)
            </label>
            <input
              className="input-field"
              placeholder="e.g. 175"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              Weight (kg)
            </label>
            <input
              className="input-field"
              placeholder="e.g. 70"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </div>
        </div>

        <div className="input-group" style={{ position: "relative" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            Medical Conditions
          </label>
          <input
            className="input-field"
            placeholder="Type to search (e.g. Diabetes)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />

          {showDropdown && search && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                background: "#fff",
                border: "1px solid #ddd",
                maxHeight: "150px",
                overflowY: "auto",
                zIndex: 10,
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                marginTop: "5px",
              }}
            >
              {filteredConditions.length === 0 ? (
                <div style={{ padding: "10px", color: "#888" }}>
                  No match found
                </div>
              ) : (
                filteredConditions.map((c) => (
                  <div
                    key={c}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => addCondition(c)}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#f0fdf4")
                    }
                    onMouseLeave={(e) => (e.target.style.background = "white")}
                  >
                    {c}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "2rem",
          }}
        >
          {form.conditions.map((c) => (
            <span
              key={c}
              style={{
                background: "var(--primary)",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {c}
              <button
                onClick={() => removeCondition(c)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Save Profile & Continue →
        </button>
      </div>
    </div>
  );
}
