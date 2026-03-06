import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "../styles/global.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [foodInput, setFoodInput] = useState("");
  const [greeting, setGreeting] = useState("Good Morning");
  const [healthProfile, setHealthProfile] = useState({ conditions: [] });
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState("en-US");

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Load profile
    const savedProfile = localStorage.getItem("healthProfile");
    if (savedProfile) {
      setHealthProfile(JSON.parse(savedProfile));
    }
  }, []);

  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Browser does not support voice recognition.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFoodInput(transcript);

      // Automatically trigger analysis after speaking
      if (transcript.trim()) {
        localStorage.setItem("food", transcript);
        localStorage.setItem("selectedLang", lang);

        // Brief delay so user can see their spoken text before redirect
        setTimeout(() => {
          navigate("/result");
        }, 800);
      }
    };

    recognition.start();
  };

  const handleAnalyze = () => {
    if (!foodInput.trim()) {
      alert("Please enter what you ate!");
      return;
    }
    localStorage.setItem("food", foodInput);
    localStorage.setItem("selectedLang", lang); // Save selected language
    navigate("/result");
  };

  const quickAdds = [
    { emoji: "🥗", text: "Caesar Salad with Chicken" },
    { emoji: "🍳", text: "2 Eggs, Toast, and Coffee" },
    { emoji: "🍔", text: "Cheeseburger and Fries" },
    { emoji: "🥤", text: "Protein Shake with Banana" },
  ];

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-logo">NUTRILENS 🥗</div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="nav-profile-btn"
            onClick={() => navigate("/history")}
            style={{
              background: "rgba(15, 23, 42, 0.05)",
              border: "1px solid rgba(15, 23, 42, 0.1)",
              color: "var(--dark)",
            }}
          >
            <span>📜 History</span>
          </button>
          <button
            className="nav-profile-btn"
            onClick={() => navigate("/health-profile")}
          >
            <span>👤 My Profile</span>
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Left Side: Welcome & Context */}
        <div className="dashboard-left">
          <div className="greeting-card">
            <div className="greeting-time">{greeting}</div>
            <h1 className="greeting-title">
              Ready to track your
              <br />
              <span>Nutrition Journey?</span>
            </h1>
            <p
              style={{
                color: "var(--gray)",
                fontSize: "1.1rem",
                lineHeight: "1.6",
              }}
            >
              Simply describe your meal, and our AI will analyze the calories,
              macros, and check for any health warnings based on your profile.
            </p>
          </div>

          <div className="health-summary">
            <span className="health-label">Active Health Profile</span>
            <div className="condition-tags">
              {healthProfile.conditions.length > 0 ? (
                healthProfile.conditions.map((c, i) => (
                  <span key={i} className="condition-tag">
                    {c}
                  </span>
                ))
              ) : (
                <span
                  className="condition-tag"
                  style={{
                    background: "#f1f5f9",
                    color: "#64748b",
                    border: "none",
                  }}
                >
                  No conditions set
                </span>
              )}
              <button
                onClick={() => navigate("/health-profile")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Analysis Card */}
        <div className="dashboard-right">
          <div className="analysis-card">
            <div className="input-group">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label className="input-label">What's on your plate?</label>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    style={{
                      padding: "5px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="en-US">English</option>
                    <option value="hi-IN">Hindi (हिंदी)</option>
                    <option value="te-IN">Telugu (తెలుగు)</option>
                  </select>
                  <button
                    className={`voice-btn-mini ${isListening ? "listening" : ""}`}
                    onClick={startListening}
                    title="Use Voice Input"
                    style={{
                      background: isListening ? "#ef4444" : "var(--primary)",
                      color: "white",
                      border: "none",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isListening ? "⬛" : "🎤"}
                  </button>
                </div>
              </div>
              <textarea
                className="food-textarea"
                placeholder="e.g. I had a bowl of oatmeal with blueberries and almonds..."
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
              />
            </div>

            <div className="action-buttons">
              <button className="analyze-btn" onClick={handleAnalyze}>
                <span>Analyze Meal</span>
                <span>✨</span>
              </button>
            </div>

            <div className="recent-section">
              <div className="recent-title">Quick Add</div>
              <div className="recent-chips">
                {quickAdds.map((item, index) => (
                  <button
                    key={index}
                    className="recent-chip"
                    onClick={() => {
                      setFoodInput(item.text);
                      localStorage.setItem("food", item.text);
                      localStorage.setItem("selectedLang", lang);
                      setTimeout(() => navigate("/result"), 500);
                    }}
                  >
                    {item.emoji} {item.text.split(" ").slice(0, 2).join(" ")}...
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
