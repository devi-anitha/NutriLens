import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Player } from "@lottiefiles/react-lottie-player";
import "../styles/global.css";

function AIAssistant({ text, isSpeaking }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: "20px",
        marginTop: "100px",
        maxWidth: "1000px"
      }}
    >
      {/* 💬 CHAT BUBBLE - VISIBLE ON THE LEFT */}
      <div
        style={{
         background: "white",
         padding: "18px",
         borderRadius: "20px 20px 0px 20px", // A tail pointing right since assistant is on right
         boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
         width: "100%",          
         maxWidth: "650px",      
         fontSize: "0.95rem",
         lineHeight: "1.6",
         textAlign: "left",      
         maxHeight: "300px",     
         overflowY: "auto",      
         overflowX: "hidden",    
         wordWrap: "break-word", 
         whiteSpace: "pre-wrap"  
        }}
      >
        {text || "Analyzing your meal..."}
      </div>

      {/* ASSISTANT CONTAINER ON THE RIGHT */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* 🔥 GLOW BACKGROUND */}
        <div
          style={{
            position: "absolute",
            width: "180px",
            height: "180px",
            background: isSpeaking
              ? "radial-gradient(circle, rgba(34,197,94,0.4), transparent)"
              : "radial-gradient(circle, rgba(34,197,94,0.15), transparent)",
            borderRadius: "50%",
            filter: "blur(20px)",
            zIndex: -1,
            transition: "all 0.4s ease"
          }}
        />

        {/* 🧠 GIF ASSISTANT */}
        <img
          src="/assistant.gif"
          alt="AI Assistant"
          style={{
            width: "300px",
            borderRadius: "20px",
            boxShadow: isSpeaking
              ? "0 0 40px rgba(34,197,94,0.6)"
              : "0 15px 35px rgba(0,0,0,0.1)",
            animation: isSpeaking
              ? "pulse 1.5s infinite ease-in-out"
              : "float 4s infinite ease-in-out",
            transition: "all 0.3s ease"
          }}
        />
      </div>

      {/* ✨ ANIMATIONS */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

export default function FoodResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state?.data;
  const selectedLang = "en-US";

  const [displayedText, setDisplayedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const typingIntervalRef = useRef(null);
  const hasSpoken = useRef(false);

  const t = { title: "Health Intelligence", sub: "AI-powered nutritional breakdown", back: "Back to Dashboard", meal: "Meal Analysis", alerts: "Health Alerts", dist: "Nutrient Distribution", sugg: "Smart Suggestions" };

  useEffect(() => {
    if (!data) {
      navigate("/dashboard");
    }
  }, [data, navigate]);

  const speakResult = () => {
    if (!data) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

      const text = data.speechText;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      const applyVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          let selectedVoice = voices.find(v => v.lang === "en-US");
          
          if (selectedVoice) {
             const femaleVariant = voices.find(v => 
               v.lang.startsWith("en") && 
               (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("samantha") || v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("google"))
             );
             if (femaleVariant) {
                 selectedVoice = femaleVariant;
             }
          }

          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }

        setIsSpeaking(true);
        let index = 0;
        setDisplayedText("");

        typingIntervalRef.current = setInterval(() => {
          if (index <= text.length) {
            setDisplayedText(text.substring(0, index));
            index++;
          } else {
            clearInterval(typingIntervalRef.current);
            setIsSpeaking(false);
          }
        }, 35);

        // Add delay before speaking (important)
        setTimeout(() => window.speechSynthesis.speak(utterance), 200);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        applyVoiceAndSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          applyVoiceAndSpeak();
          window.speechSynthesis.onvoiceschanged = null;
        };
        // Fallback support
        setTimeout(() => {
          if (window.speechSynthesis.onvoiceschanged !== null) {
             window.speechSynthesis.onvoiceschanged = null;
             applyVoiceAndSpeak();
          }
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (data && !hasSpoken.current) {
      hasSpoken.current = true;
      setTimeout(() => speakResult(), 500);
    }
  }, [data]);

  if (!data) {
    return null;
  }

  // --- PIE CHART DATA ---
  const vitaminsTotal = data.calcium + data.iron + data.potassium + data.vitaminC + data.sodium;
  
  const pieData = [
    { name: "Carbohydrates", value: data.carbs || 0 },
    { name: "Protein", value: data.protein || 0 },
    { name: "Fat", value: data.fat || 0 },
    { name: "Fiber", value: data.fiber || 0 },
    
  ].filter(item => item.value > 0);
  
  // Premium soft colors
  const COLORS = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#06b6d4', '#ec4899'];

  return (
    <>
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>

      <div className="page-container" style={{ 
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "flex-start", 
        gap: "4rem", 
        paddingTop: "6rem", 
        paddingBottom: "6rem", 
        paddingLeft: "5%", 
        paddingRight: "5%", 
        flexWrap: "wrap",
        background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)",
        minHeight: "100vh"
      }}>
        
        {/* RESULT CARD - WIDER TO ACCOMMODATE SPLIT LAYOUT */}
        <div className="glass-card" style={{ 
          width: "100%", 
          maxWidth: "960px", 
          flex: "1 1 600px",
          padding: "3rem",
          borderRadius: "32px",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)",
          animation: "fadeInUp 0.6s ease-out forwards"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "2.5rem", letterSpacing: "-1.5px", fontWeight: 800, color: "var(--dark)" }}>{t.title}</h1>
              <p style={{ color: "var(--gray)", fontSize: "1rem", marginTop: "0.5rem", fontWeight: 500 }}>{t.sub}</p>
            </div>
            <button className="btn btn-outline" style={{ 
              padding: "0.75rem 1.5rem", 
              fontSize: "0.95rem", 
              borderRadius: "14px",
              border: "1px solid rgba(0,0,0,0.08)",
              background: "white"
            }} onClick={() => navigate("/dashboard")}>
              &larr; {t.back}
            </button>
          </div>

          <div style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
            padding: "2rem 2.5rem",
            borderRadius: "24px",
            marginBottom: "2.5rem",
            border: "1px solid white",
            boxShadow: "0 10px 20px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
          }}>
            <p style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "2px" }}>{t.meal}</p>
            <h2 style={{ textTransform: "capitalize", color: "var(--dark)", fontSize: "2.2rem", margin: 0, fontWeight: 800 }}>{data.food}</h2>
          </div>

          {data.warnings.length > 0 && (
            <div style={{
              background: "rgba(254, 226, 226, 0.8)",
              padding: "1.25rem 1.5rem",
              borderRadius: "16px",
              marginBottom: "2rem",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#991b1b"
            }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
                <span>⚠️</span> {t.alerts}
              </h3>
              <ul style={{ paddingLeft: "1.5rem", margin: 0, listStyleType: "circle", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {data.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          {/* ----- SPLIT SECTION: LEFT GRID + RIGHT CHART ----- */}
          <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", marginBottom: "2rem" }}>
            
            {/* LEFT: Complete Nutrient Grid */}
            <div style={{ flex: "1 1 450px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "1rem"
              }}>
                <StatBox label="Calories" value={data.calories} icon="🔥" unit="kcal" />
                <StatBox label="Protein" value={data.protein} icon="💪" unit="g" />
                <StatBox label="Carbs" value={data.carbs} icon="🍞" unit="g" />
                <StatBox label="Fat" value={data.fat} icon="🥑" unit="g" />
                <StatBox label="Fiber" value={data.fiber} icon="🥗" unit="g" />
                <StatBox label="Sugar" value={data.sugar} icon="🍭" unit="g" />
                
                {/* Advanced Micro Nutrients */}
                <StatBox label="Sodium" value={data.sodium} icon="🧂" unit="mg" />
                <StatBox label="Cholesterol" value={data.cholesterol} icon="🩸" unit="mg" />
                <StatBox label="Vitamin C" value={data.vitaminC} icon="🍋" unit="mg" />
                <StatBox label="Calcium" value={data.calcium} icon="🥛" unit="mg" />
                <StatBox label="Iron" value={data.iron} icon="🥩" unit="mg" />
                <StatBox label="Potassium" value={data.potassium} icon="🍌" unit="mg" />
              </div>
            </div>

            {/* RIGHT: Data Visualization Pie Chart */}
            <div style={{ 
              flex: "1 1 300px", 
              background: "rgba(255, 255, 255, 0.5)", 
              borderRadius: "16px", 
              padding: "1.5rem",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--dark)", marginBottom: "1rem" }}>{t.dist}</h3>
              
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`${value}g/mg`, undefined]}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '0.85rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>

          </div>

          {data.suggestions?.length > 0 && (
            <div style={{ textAlign: "left" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <span>💡</span> {t.sugg}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {data.suggestions.map((s, i) => (
                  <div key={i} style={{
                    background: "rgba(241, 245, 249, 0.6)",
                    padding: "1rem",
                    borderRadius: "12px",
                    borderLeft: "4px solid var(--secondary)",
                    fontSize: "0.95rem",
                    color: "var(--dark)"
                  }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI ASSISTANT */}
        <AIAssistant text={displayedText} isSpeaking={isSpeaking} />
      </div>
    </>
  );
}

function StatBox({ label, value, icon, unit }) {
  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.8)",
      padding: "1.25rem",
      borderRadius: "16px",
      border: "1px solid rgba(255, 255, 255, 0.8)",
      boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      transition: "transform 0.2s"
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>{icon}</div>
      <p style={{ fontSize: "0.75rem", color: "var(--gray)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.25rem" }}>{label}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
        <h3 style={{ margin: 0, fontSize: "1.3rem", color: "var(--dark)" }}>{value}</h3>
        {unit && <span style={{ fontSize: "0.75rem", color: "var(--gray)", fontWeight: "600" }}>{unit}</span>}
      </div>
    </div>
  );
}