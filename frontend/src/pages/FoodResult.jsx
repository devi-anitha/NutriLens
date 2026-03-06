import { analyzeFood } from "../utils/foodAnalysis";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import "../styles/global.css";

export default function FoodResult() {
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const typingIntervalRef = useRef(null);
  const food = localStorage.getItem("food") || "";
  const selectedLang = localStorage.getItem("selectedLang") || "en-US";
  const healthProfile = JSON.parse(localStorage.getItem("healthProfile")) || {};
  const conditions = healthProfile.conditions || [];

  const data = analyzeFood(food.toLowerCase(), conditions, selectedLang);

  // Store history on load
  useEffect(() => {
    if (data && food) {
      const history = JSON.parse(localStorage.getItem("foodHistory") || "[]");
      const newEntry = {
        id: Date.now(),
        food: data.food,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        fiber: data.fiber,
        sodium: data.sodium,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        warnings: data.warnings,
      };

      // Prevent duplicate entries for same session
      const lastEntry = history[0];
      if (
        !lastEntry ||
        lastEntry.food !== newEntry.food ||
        Date.now() - lastEntry.id > 10000
      ) {
        localStorage.setItem(
          "foodHistory",
          JSON.stringify([newEntry, ...history].slice(0, 50)),
        );
      }
    }
  }, [data, food]);

  const speakResult = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      setDisplayedText("");

      const text = data.speechText;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentSpeechText(text);

        // Typing effect logic
        let index = 0;
        const typingSpeed = selectedLang === "en-US" ? 50 : 70; // Adjust speed for regional languages
        typingIntervalRef.current = setInterval(() => {
          if (index < text.length) {
            setDisplayedText((prev) => prev + text.charAt(index));
            index++;
          } else {
            clearInterval(typingIntervalRef.current);
          }
        }, typingSpeed);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        // Keep the text visible for a moment after speaking
        setTimeout(() => {
          if (!window.speechSynthesis.speaking) {
            setDisplayedText("");
            setCurrentSpeechText("");
          }
        }, 2000);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!food || !food.trim()) {
      navigate("/dashboard");
    }
    const timer = setTimeout(() => {
      speakResult();
    }, 1200);
    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, [food, navigate]);

  return (
    <div
      className="page-container"
      style={{ background: "#f8fafc", padding: "2rem", position: "relative" }}
    >
      {/* Hyper-Realistic 3D Human AI Assistant */}
      <div
        style={{
          position: "fixed",
          left: "50px",
          bottom: "40px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "280px",
        }}
      >
        {/* Perfect AI 3D Animated Assistant Container */}
        <div
          style={{
            width: "320px",
            height: "550px", // Increased height to accommodate scrolling text
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            perspective: "1000px",
          }}
        >
          {/* Speaking Text / Captions Panel - Positioned to the side of the avatar */}
          {isSpeaking && displayedText && (
            <div
              style={{
                position: "absolute",
                left: "115%", // Slightly more space
                top: "40%", // Centered better relative to the avatar body
                transform: "translateY(-50%)",
                width: "320px",
                maxHeight: "250px",
                background: "rgba(15, 23, 42, 0.95)",
                backdropFilter: "blur(20px)",
                padding: "1.5rem",
                borderRadius: "24px",
                border: "1px solid rgba(34, 197, 94, 0.5)",
                color: "white",
                fontSize: "0.95rem",
                fontWeight: "600",
                textAlign: "left",
                overflowY: "auto",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                zIndex: 10,
                lineHeight: "1.6",
                borderLeft: "5px solid var(--primary)",
              }}
            >
              <div
                style={{
                  color: "var(--primary)",
                  fontSize: "0.75rem",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: "900",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "#22c55e",
                    borderRadius: "50%",
                    animation: "pulse 1s infinite",
                  }}
                ></span>
                Live AI Transcription
              </div>
              {displayedText}
            </div>
          )}

          {/* Holographic Platform Base */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              width: "260px",
              height: "130px",
              background:
                "radial-gradient(ellipse at center, rgba(34, 197, 94, 0.4) 0%, transparent 70%)",
              transform: "rotateX(75deg)",
              borderRadius: "50%",
              boxShadow: "0 0 60px rgba(34, 197, 94, 0.7)",
              zIndex: 0,
            }}
          ></div>

          {/* Main 3D AI Assistant - Using high-quality professional asset */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "420px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
              transition: "all 0.5s ease",
            }}
          >
            {/* Using a high-quality professional 3D human presenter image (Extremely Stable) */}
            <img
              src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
              alt="3D AI Assistant"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: isSpeaking
                  ? "drop-shadow(0 0 30px rgba(34, 197, 94, 0.6)) contrast(1.1)"
                  : "drop-shadow(0 20px 40px rgba(0,0,0,0.2))",
                animation: isSpeaking
                  ? "acting 3s infinite ease-in-out"
                  : "float 6s infinite ease-in-out",
              }}
            />

            {/* Professional Digital Scanning Beam */}
            {isSpeaking && (
              <div
                style={{
                  position: "absolute",
                  top: "20%",
                  left: "5%",
                  right: "5%",
                  height: "4px",
                  background: "rgba(34, 197, 94, 0.9)",
                  boxShadow: "0 0 30px rgba(34, 197, 94, 1)",
                  zIndex: 3,
                  animation: "scan 2.5s infinite linear",
                  borderRadius: "50%",
                }}
              ></div>
            )}

            {/* Real-time Voice Visualizer */}
            {isSpeaking && (
              <div
                style={{
                  position: "absolute",
                  bottom: "15%",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  zIndex: 4,
                  padding: "12px 25px",
                  background: "rgba(15, 23, 42, 0.85)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "50px",
                  border: "1px solid rgba(34, 197, 94, 0.5)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "4px",
                      height: "12px",
                      background: "var(--primary)",
                      borderRadius: "10px",
                      animation: `wave 0.4s infinite ease-in-out ${i * 0.05}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>

          {/* Modern Speech Bubble - Moved to Bottom */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(10px)",
              padding: "1rem 1.5rem",
              borderRadius: "24px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.18)",
              marginTop: "20px",
              border: "1px solid rgba(34, 197, 94, 0.4)",
              position: "relative",
              animation: "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 5,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                fontWeight: "700",
                color: "#1e293b",
                textAlign: "center",
                lineHeight: "1.4",
              }}
            >
              {isSpeaking
                ? "Speaking your nutrition report..."
                : "Hi! I'm your AI health assistant."}
            </p>
            {/* Pointer facing up now */}
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid white",
              }}
            ></div>
          </div>

          {/* AI Operation Control Panel */}
          <div
            style={{
              marginTop: "15px",
              padding: "10px 25px",
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(15px)",
              borderRadius: "50px",
              border: `1px solid ${isSpeaking ? "rgba(34, 197, 94, 0.6)" : "rgba(148, 163, 184, 0.4)"}`,
              fontSize: "0.8rem",
              fontWeight: "900",
              color: isSpeaking ? "var(--primary)" : "#94a3b8",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              zIndex: 5,
              boxShadow: isSpeaking
                ? "0 0 25px rgba(34, 197, 94, 0.3)"
                : "none",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                background: isSpeaking ? "#22c55e" : "#475569",
                borderRadius: "50%",
                animation: isSpeaking ? "pulse 1.2s infinite" : "none",
                boxShadow: isSpeaking ? "0 0 12px #22c55e" : "none",
              }}
            ></span>
            {isSpeaking ? "AI Presenter: Speaking" : "AI Presenter: Idle"}
          </div>
        </div>

        {/* Advanced Narration Button */}
        <button
          onClick={speakResult}
          style={{
            background: isSpeaking
              ? "rgba(239, 68, 68, 0.1)"
              : "linear-gradient(135deg, #22c55e, #15803d)",
            color: isSpeaking ? "#ef4444" : "white",
            border: isSpeaking ? "2px solid #ef4444" : "none",
            borderRadius: "50px",
            padding: "14px 35px",
            fontSize: "1rem",
            marginTop: "30px",
            cursor: "pointer",
            fontWeight: "900",
            letterSpacing: "0.5px",
            boxShadow: isSpeaking
              ? "0 10px 30px rgba(239, 68, 68, 0.2)"
              : "0 12px 30px rgba(34, 197, 94, 0.4)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-6px) scale(1.04)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0) scale(1)")
          }
        >
          {isSpeaking ? (
            <>
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  background: "#ef4444",
                  borderRadius: "50%",
                  animation: "pulse 1s infinite",
                }}
              ></span>
              Stop AI Report
            </>
          ) : (
            <>🔊 Hear Full Analysis</>
          )}
        </button>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "650px",
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "5%",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          animation: "fadeInUp 0.8s ease-out",
        }}
      >
        <h1
          style={{
            marginBottom: "1.5rem",
            fontSize: "2rem",
            background: "linear-gradient(135deg, #1e293b, #334155)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "800",
          }}
        >
          Health Intelligence ⚡
        </h1>

        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
            padding: "1.5rem",
            borderRadius: "20px",
            marginBottom: "2rem",
            border: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              color: "var(--gray)",
              fontSize: "0.85rem",
              marginBottom: "0.5rem",
              fontWeight: "700",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Analyzed Meal
          </p>
          <h3
            style={{
              fontSize: "2rem",
              textTransform: "capitalize",
              color: "var(--dark)",
              margin: 0,
            }}
          >
            {data.food}
          </h3>
        </div>

        {/* Health Alerts - Moved to be immediately below the food item */}
        {data.warnings.length > 0 ? (
          <div
            style={{
              background: "rgba(255, 241, 242, 0.8)",
              padding: "1.2rem 1.5rem",
              borderRadius: "20px",
              marginBottom: "1.5rem",
              border: "1px solid #fda4af",
              textAlign: "left",
              animation: "fadeInUp 0.6s ease-out",
            }}
          >
            <h3
              style={{
                color: "#e11d48",
                marginBottom: "0.8rem",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "800",
              }}
            >
              ⚠️ Health Alerts
            </h3>
            {data.warnings.map((w) => (
              <p
                key={w}
                style={{
                  color: "#9f1239",
                  marginBottom: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  lineHeight: "1.4",
                }}
              >
                • {w}
              </p>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "rgba(240, 253, 244, 0.8)",
              padding: "1.2rem 1.5rem",
              borderRadius: "20px",
              marginBottom: "1.5rem",
              border: "1px solid #86efac",
              color: "#166534",
              fontWeight: "700",
              fontSize: "1rem",
              animation: "fadeInUp 0.6s ease-out",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>✅</span>{" "}
            {data.speechText.includes("safe")
              ? "This meal is perfectly safe for you!"
              : "Nutritional analysis ready."}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.25rem",
            marginBottom: "2.5rem",
          }}
        >
          <StatBox label="Calories" value={data.calories} icon="🔥" />
          <StatBox label="Protein" value={`${data.protein}g`} icon="💪" />
          <StatBox label="Carbs" value={`${data.carbs}g`} icon="🍞" />
          <StatBox label="Fat" value={`${data.fat}g`} icon="🥑" />
          <StatBox label="Fiber" value={`${data.fiber}g`} icon="🥗" />
          <StatBox label="Sodium" value={`${data.sodium}mg`} icon="🧂" />
        </div>

        {data.suggestions?.length > 0 && (
          <div
            style={{
              background: "rgba(239, 246, 255, 0.8)",
              padding: "1.5rem",
              borderRadius: "20px",
              marginBottom: "1.5rem",
              border: "1px solid #93c5fd",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                color: "#2563eb",
                marginBottom: "1rem",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              💡 Smart Suggestions
            </h3>
            {data.suggestions.map((s) => (
              <p
                key={s}
                style={{
                  color: "#1e40af",
                  marginBottom: "0.8rem",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
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
              background: "rgba(250, 245, 255, 0.8)",
              padding: "1.5rem",
              borderRadius: "20px",
              marginBottom: "2rem",
              border: "1px solid #d8b4fe",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                color: "#7c3aed",
                marginBottom: "1rem",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              🔍 Deep Insights
            </h3>
            {data.insights.map((i) => (
              <p
                key={i}
                style={{
                  color: "#5b21b6",
                  marginBottom: "0.8rem",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
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
          style={{
            width: "100%",
            padding: "1.2rem",
            fontSize: "1.1rem",
            boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)",
            borderRadius: "20px",
          }}
        >
          Check Another Meal
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div
      style={{
        background: "white",
        padding: "1.25rem 1rem",
        borderRadius: "20px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-5px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--gray)",
          textTransform: "uppercase",
          fontWeight: "800",
          letterSpacing: "0.5px",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "1.4rem",
          fontWeight: "900",
          color: "#1e293b",
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}
