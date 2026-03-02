import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.nav}>
        <h2>NUTRILENS 🥗</h2>

        <div>
          <button style={styles.outlineBtn} onClick={() => navigate("/auth")}>
            Sign In
          </button>

          <button style={styles.greenBtn} onClick={() => navigate("/auth")}>
            Sign Up
          </button>
        </div>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1>Eat Smart. Live Healthy.</h1>

          <p>
            AI powered nutrition analysis, smart health warnings, voice food
            input and personalized insights.
          </p>

          <button style={styles.bigBtn} onClick={() => navigate("/auth")}>
            Get Started →
          </button>
        </div>

        {/* Food visuals */}
        <div style={styles.foodVisual}>🍎 🥑 🍗 🍚 🥦 🍓 🍞 🧃</div>
      </div>

      {/* FEATURES */}
      <div style={styles.features}>
        <Card icon="🍛" title="Food Analysis" text="Instant nutrition scan" />
        <Card icon="🎤" title="Voice Input" text="Speak your meals" />
        <Card icon="🧠" title="Smart Warnings" text="BP & Diabetes alerts" />
        <Card icon="📊" title="Nutrition Charts" text="Visual insights" />
      </div>
    </div>
  );
}

function Card({ icon, title, text }) {
  return (
    <div style={styles.card}>
      <h3>
        {icon} {title}
      </h3>
      <p>{text}</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#e8f7f1,#d7efe6,#c6e8db)",
    fontFamily: "sans-serif",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 40px",
    background: "pink",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "80px 60px",
  },

  heroText: {
    maxWidth: 500,
  },

  foodVisual: {
    fontSize: 60,
    letterSpacing: 10,
    background: "red",
    padding: 30,
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 20,
    padding: "40px 60px",
  },

  card: {
    background: "grey",
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  greenBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    marginLeft: 10,
    cursor: "pointer",
  },

  outlineBtn: {
    border: "2px solid #22c55e",
    background: "white",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
  },

  bigBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "14px 26px",
    borderRadius: 10,
    marginTop: 20,
    fontSize: 16,
    cursor: "pointer",
  },
};
