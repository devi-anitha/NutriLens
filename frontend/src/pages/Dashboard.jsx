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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const t = { welcome: "Welcome Back", track: "Let's track your nutrition.", profile: "Active Health Profile", empty: "No conditions set", what: "What did you eat today?", btn: "Analyze Meal ⚡", load: "Analyzing Intelligence..." };


  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const savedProfile = localStorage.getItem("healthProfile");

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setHealthProfile({
          conditions: parsed?.conditions || parsed?.health_issues || [],
        });
      } catch (e) {
        console.error("Profile parse error", e);
        setHealthProfile({ conditions: [] });
      }
    }
  }, []);

  // ---------------- VOICE ----------------
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
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFoodInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.start();
  };

  // ---------------- ANALYZE ----------------
  const executeAnalysis = async (text) => {
    if (!text.trim()) {
      alert("Please enter what you ate!");
      return;
    }

    setIsAnalyzing(true);

    const foods = text
      .toLowerCase()
      .split(/,|and/)
      .map((f) => f.trim())
      .filter(Boolean);

    const ingredients = foods.map((name) => ({
      name,
      quantity: 100,
      unit: "g",
    }));

    try {
      const creds = localStorage.getItem("userCredentials");
      const user = creds ? JSON.parse(creds) : null;

      console.log("USER:", user);
      
      if (!user || user.id === undefined || user.id === null) {
        alert("Please login again. User ID is missing.");
        navigate("/auth");
        return;
      }

      console.log("PAYLOAD:", {
        user_id: user?.id,
        ingredients: ingredients
      });

      const response = await fetch(`http://127.0.0.1:8000/analyze-meal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          ingredients: ingredients,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          alert("Profile missing! Please set up your Health Profile first.");
          navigate("/health-profile");
          return;
        }
        throw new Error("Backend error");
      }

      const result = await response.json();
      console.log("API RESPONSE:", result);

      const formattedData = {
        food: ingredients.map((i) => i.name).join(", "),
        calories: result.nutrients?.Calories || 0,
        protein: result.nutrients?.Protein || 0,
        carbs: result.nutrients?.Carbs || 0,
        fat: result.nutrients?.Fat || 0,
        fiber: result.nutrients?.Fiber || 0,
        sodium: result.nutrients?.Sodium || 0,
        sugar: result.nutrients?.Sugar || 0,
        cholesterol: result.nutrients?.Cholesterol || 0,
        calcium: result.nutrients?.Calcium || 0,
        iron: result.nutrients?.Iron || 0,
        potassium: result.nutrients?.Potassium || 0,
        vitaminC: result.nutrients?.["Vitamin C"] || 0,
        warnings: result.health_analysis?.notes || [],
        suggestions: result.recommendations?.add || [],
        speechText: result.ai_message || "Here is your meal analysis.",
      };

      navigate("/result", {
        state: { data: formattedData },
      });

    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    executeAnalysis(foodInput);
  };

  // ---------------- QUICK ADD ----------------
  const quickAdds = [
    { emoji: "🥗", text: "Caesar Salad with Chicken" },
    { emoji: "🍳", text: "2 Eggs, Toast, and Coffee" },
    { emoji: "🍔", text: "Cheeseburger and Fries" },
    { emoji: "🥤", text: "Protein Shake with Banana" },
  ];

  // ---------------- UI ----------------
  return (
    <>
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>
      
      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <div className="nav-logo">NUTRILENS 🥗</div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

            <button
              className="nav-profile-btn"
              onClick={() => navigate("/history")}
            >
              📜 History
            </button>

            <button
              className="nav-profile-btn"
              onClick={() => navigate("/health-profile")}
            >
              👤 My Profile
            </button>
          </div>
        </nav>

        <div className="dashboard-content">
          {/* LEFT */}
          <div className="dashboard-left">
            <div className="greeting-card">
              <div className="greeting-time">{t.welcome}</div>
              <h1 className="greeting-title">
                {greeting}, <span>{t.track}</span>
              </h1>
            </div>

            <div className="health-summary">
              <span className="health-label">{t.profile}</span>

              <div className="condition-tags">
                {healthProfile?.conditions?.length > 0 ? (
                  healthProfile.conditions.map((c, i) => (
                    <span key={i} className="condition-tag">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="condition-tag" style={{ background: "#f8fafc", color: "#64748b" }}>
                    {t.empty}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="dashboard-right">
            <div className="analysis-card">
              <div className="input-label">
                {t.what}
                <button 
                  className="voice-btn-mini" 
                  onClick={startListening}
                  title="Use Voice Input"
                >
                  {isListening ? "🎙️" : "🎤"}
                </button>
              </div>

              <textarea
                className="food-textarea"
                placeholder="E.g., 2 slices of whole wheat bread, 1 avocado, and a cup of black coffee..."
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
              />

              <div className="action-buttons">
                <button 
                  className="analyze-btn" 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? t.load : t.btn}
                </button>
              </div>

              <div className="recent-section">
                <div className="recent-title">Quick Add</div>
                <div className="recent-chips">
                  {quickAdds.map((item, i) => (
                    <button
                      key={i}
                      className="recent-chip"
                      onClick={() => {
                        setFoodInput(item.text);
                        // executeAnalysis(item.text); // auto-submit if desired, currently sets text
                      }}
                    >
                      {item.emoji} {item.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}