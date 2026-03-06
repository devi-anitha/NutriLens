import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import "../styles/global.css";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem("foodHistory") || "[]",
    );
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      localStorage.setItem("foodHistory", "[]");
      setHistory([]);
    }
  };

  return (
    <div className="page-container" style={{ background: "#f8fafc" }}>
      <nav className="dashboard-nav">
        <div
          className="nav-logo"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          NUTRILENS 🥗
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="nav-profile-btn"
            onClick={() => navigate("/dashboard")}
          >
            <span>🏠 Dashboard</span>
          </button>
          <button
            className="nav-profile-btn"
            onClick={() => navigate("/health-profile")}
          >
            <span>👤 Profile</span>
          </button>
        </div>
      </nav>

      <div
        className="card"
        style={{ maxWidth: "800px", margin: "2rem auto", padding: "2rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: "#1e293b",
              margin: 0,
            }}
          >
            Meal History 📜
          </h1>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                background: "none",
                border: "1px solid #ef4444",
                color: "#ef4444",
                padding: "8px 15px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽️</div>
            <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>
              No meals logged yet.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/dashboard")}
              style={{ marginTop: "1rem" }}
            >
              Analyze Your First Meal
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {history.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "1.5rem",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        textTransform: "capitalize",
                        margin: "0 0 5px 0",
                        color: "#1e293b",
                      }}
                    >
                      {item.food}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      {item.date} • {item.time}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                      padding: "5px 12px",
                      borderRadius: "50px",
                      fontSize: "0.85rem",
                      fontWeight: "800",
                    }}
                  >
                    {item.calories} kcal
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "10px",
                    marginBottom: "1rem",
                  }}
                >
                  <MiniStat label="Prot" value={`${item.protein}g`} />
                  <MiniStat label="Carb" value={`${item.carbs}g`} />
                  <MiniStat label="Fat" value={`${item.fat}g`} />
                  <MiniStat label="Fib" value={`${item.fiber}g`} />
                  <MiniStat label="Sod" value={`${item.sodium}mg`} />
                </div>

                {item.warnings.length > 0 && (
                  <div
                    style={{
                      background: "#fff1f2",
                      padding: "10px 15px",
                      borderRadius: "12px",
                      border: "1px solid #fda4af",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        color: "#e11d48",
                        fontWeight: "700",
                      }}
                    >
                      ⚠️ {item.warnings.length} Alerts:{" "}
                      {item.warnings.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        padding: "8px",
        borderRadius: "10px",
        textAlign: "center",
        border: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          fontSize: "0.65rem",
          color: "#94a3b8",
          fontWeight: "800",
          textTransform: "uppercase",
          marginBottom: "2px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#334155" }}>
        {value}
      </div>
    </div>
  );
}
