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
      style={{
        background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.4) 100%), url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: "2rem 1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Blur Overlays */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: "blur(2px)",
          zIndex: 0,
        }}
      ></div>

      {/* Side Decorative Blobs */}
      <div
        style={{
          position: "absolute",
          left: "-100px",
          top: "10%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%",
          zIndex: 0,
          filter: "blur(40px)",
          animation: "blob-float 8s infinite alternate",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          right: "-100px",
          bottom: "10%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%",
          zIndex: 0,
          filter: "blur(40px)",
          animation: "blob-float 8s infinite alternate-reverse",
        }}
      ></div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          borderRadius: "28px",
          padding: "2.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          position: "relative",
          zIndex: 1,
          animation: "fadeInUp 0.6s ease-out",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "rgba(34, 197, 94, 0.1)",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 1rem",
              color: "var(--primary)",
              boxShadow: "0 8px 16px rgba(34, 197, 94, 0.1)",
            }}
          >
            🩺
          </div>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              color: "#1e293b",
              marginBottom: "0.5rem",
              letterSpacing: "-0.5px",
            }}
          >
            Health Profile
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.95rem",
              fontWeight: "500",
              lineHeight: "1.4",
            }}
          >
            Tell us about yourself for personalized AI analysis.
          </p>
        </div>

        <div className="input-group" style={{ marginBottom: "1.25rem" }}>
          <label
            style={{
              fontSize: "0.85rem",
              fontWeight: "700",
              color: "#475569",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Full Name
          </label>
          <input
            className="input-field"
            placeholder="Enter your name"
            style={{
              borderRadius: "12px",
              padding: "12px 16px",
              background: "white",
              border: "1px solid #e2e8f0",
              fontSize: "1rem",
              fontWeight: "600",
              color: "#1e293b",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <div className="input-group">
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "0.85rem",
                fontWeight: "700",
                color: "#475569",
              }}
            >
              Date of Birth
            </label>
            <input
              className="input-field"
              type="date"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                background: "white",
                border: "1px solid #e2e8f0",
                color: "#1e293b",
                fontWeight: "600",
                width: "100%",
                fontSize: "0.95rem",
              }}
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "0.85rem",
                fontWeight: "700",
                color: "#475569",
              }}
            >
              Gender
            </label>
            <select
              className="input-field"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                background: "white",
                border: "1px solid #e2e8f0",
                color: "#1e293b",
                fontWeight: "600",
                width: "100%",
                fontSize: "0.95rem",
              }}
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
            gap: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <div className="input-group">
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "0.85rem",
                fontWeight: "700",
                color: "#475569",
              }}
            >
              Height (cm)
            </label>
            <input
              className="input-field"
              placeholder="e.g. 175"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                background: "white",
                border: "1px solid #e2e8f0",
                color: "#1e293b",
                fontWeight: "600",
                fontSize: "0.95rem",
              }}
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "0.85rem",
                fontWeight: "700",
                color: "#475569",
              }}
            >
              Weight (kg)
            </label>
            <input
              className="input-field"
              placeholder="e.g. 70"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                background: "white",
                border: "1px solid #e2e8f0",
                color: "#1e293b",
                fontWeight: "600",
                fontSize: "0.95rem",
              }}
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </div>
        </div>

        <div
          className="input-group"
          style={{ position: "relative", marginBottom: "1rem" }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "0.85rem",
              fontWeight: "700",
              color: "#475569",
            }}
          >
            Medical Conditions
          </label>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: "1rem",
              }}
            >
              🔍
            </span>
            <input
              className="input-field"
              placeholder="Search conditions..."
              style={{
                borderRadius: "12px",
                padding: "12px 16px 12px 45px",
                background: "white",
                border: "1px solid #e2e8f0",
                color: "#1e293b",
                fontWeight: "600",
                fontSize: "0.95rem",
              }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
          </div>

          {showDropdown && search && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                background: "white",
                border: "1px solid #e2e8f0",
                maxHeight: "180px",
                overflowY: "auto",
                zIndex: 10,
                borderRadius: "14px",
                boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                marginTop: "8px",
              }}
            >
              {filteredConditions.map((c) => (
                <div
                  key={c}
                  style={{
                    padding: "10px 18px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#475569",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => addCondition(c)}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "1.5rem",
            minHeight: "35px",
          }}
        >
          {form.conditions.map((c) => (
            <span
              key={c}
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                color: "var(--primary-dark)",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                border: "1px solid rgba(34, 197, 94, 0.2)",
              }}
            >
              {c}
              <button
                onClick={() => removeCondition(c)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  padding: 0,
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
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "14px",
            fontSize: "1.1rem",
            fontWeight: "800",
            background: "var(--primary)",
            border: "none",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(34, 197, 94, 0.2)",
            transition: "all 0.3s ease",
          }}
        >
          Save Profile & Continue →
        </button>
      </div>
    </div>
  );
}
