import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const API = "http://127.0.0.1:8000";

const CONDITIONS = [
  "Diabetes Type 1","Diabetes Type 2","High Blood Pressure","Low Blood Pressure",
  "Heart Disease","Asthma","Thyroid","Obesity","Anemia","High Cholesterol",
  "Kidney Disease","Liver Disease","Gastritis","Acid Reflux (GERD)","IBS",
  "Arthritis","Osteoporosis","Migraine","Depression","Anxiety","Sleep Apnea",
  "PCOS","Pregnancy","Food Allergy","Lactose Intolerance","Celiac Disease",
  "Gout","Stroke History","Cancer History","Hypertension","Hypothyroidism",
  "Hyperthyroidism","Vitamin D Deficiency","Vitamin B12 Deficiency",
  "Smoking","Alcohol Consumption","Post Surgery Recovery"
];

export default function HealthProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    conditions: [],
  });

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // ---------------- LOAD PROFILE ----------------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userCredentials"));

        if (!user) {
          navigate("/auth");
          return;
        }

        const res = await fetch(`${API}/user/profile/${user.id}`);

        if (res.ok) {
          const data = await res.json();
          const estimatedDob = data.age ? `${new Date().getFullYear() - data.age}-01-01` : "";

          setForm({
            name: data.name || "",
            dob: estimatedDob,
            gender: data.gender || "",
            conditions: data.health_issues || [],
          });

          localStorage.setItem("healthProfile", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Load error:", err);
      }
    };

    loadProfile();
  }, [navigate]);

  // ---------------- ADD CONDITION ----------------
  const addCondition = (c) => {
    if (!form.conditions.includes(c)) {
      setForm({ ...form, conditions: [...form.conditions, c] });
    }
    setSearch("");
    setShowDropdown(false);
  };

  const removeCondition = (c) => {
    setForm({
      ...form,
      conditions: form.conditions.filter((i) => i !== c),
    });
  };

  // ---------------- SAVE PROFILE ----------------
  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("userCredentials"));

    if (!user) {
      alert("Please login first");
      navigate("/auth");
      return;
    }

    try {
      const existingAge = JSON.parse(localStorage.getItem("healthProfile"))?.age || 25;
      const age = form.dob
        ? new Date().getFullYear() - new Date(form.dob).getFullYear()
        : existingAge;

      const payload = {
        user_id: user.id,
        name: form.name || "User",
        age: age,
        gender: form.gender || "Other",
        health_issues: form.conditions || [],
        primary_goal: "General Health",
      };

      const res = await fetch(`${API}/user/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result);
        throw new Error(result.detail || "Save failed");
      }

      localStorage.setItem("healthProfile", JSON.stringify(payload));
      navigate("/dashboard");

    } catch (err) {
      console.error("❌ Save error:", err);
      alert("Profile save failed");
    }
  };

  const filtered = CONDITIONS.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>
      <div className="page-container" style={{ justifyContent: "center", padding: "2rem" }}>
        <div className="glass-card" style={{ width: "100%", maxWidth: "500px" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center", fontSize: "2rem" }}>
            Health Profile <span style={{fontSize: "1.5rem"}}>🩺</span>
          </h2>

          <div className="input-group">
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.95rem" }}>Full Name</label>
            <input
              className="input-field"
              placeholder="e.g. Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.95rem" }}>Date of Birth</label>
            <input
              className="input-field"
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.95rem" }}>Gender</label>
            <select
              className="input-field"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="input-group" style={{ position: "relative" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.95rem" }}>Health Conditions</label>
            <input
              className="input-field"
              placeholder="Search condition (e.g. Diabetes...)"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
            />

            {showDropdown && search && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                maxHeight: "200px",
                overflowY: "auto",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                zIndex: 10,
                marginTop: "0.5rem",
                border: "1px solid rgba(0,0,0,0.05)",
                padding: "0.5rem"
              }}>
                {filtered.length > 0 ? filtered.map((c) => (
                  <div 
                    key={c} 
                    onClick={() => addCondition(c)}
                    style={{
                      padding: "0.7rem 1rem",
                      cursor: "pointer",
                      borderRadius: "8px",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {c}
                  </div>
                )) : (
                  <div style={{ padding: "0.7rem 1rem", color: "#64748b" }}>No conditions found</div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
            {form.conditions.map((c) => (
              <span 
                key={c} 
                onClick={() => removeCondition(c)}
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  color: "var(--primary-dark)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(34, 197, 94, 0.1)"}
                title="Click to remove"
              >
                {c} <span style={{fontSize: "0.7rem"}}>❌</span>
              </span>
            ))}
          </div>

          <button className="btn btn-primary" style={{ width: "100%", padding: "1rem" }} onClick={handleSave}>
            Save Profile
          </button>
        </div>
      </div>
    </>
  );
}