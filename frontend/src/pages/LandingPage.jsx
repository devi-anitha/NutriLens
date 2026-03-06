import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import "../styles/global.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">NUTRILENS 🥗</div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-outline" onClick={() => navigate("/auth")}>
            Sign In
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/auth")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-tag">✨ AI-Powered Nutrition</span>
          <h1 className="hero-title">
            Eat Smart.
            <br />
            Live Healthy.
          </h1>
          <p className="hero-subtitle">
            Instantly analyze your food with AI, get personalized health
            warnings, and track your nutrition journey. Voice input supported.
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate("/auth")}
            >
              Start Analyzing Now
            </button>
            <button
              className="btn btn-white btn-large"
              onClick={() => navigate("/auth")}
            >
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Nutrilens?</h2>
          <p className="section-desc">
            Advanced technology to keep your diet in check, specifically
            tailored for your health conditions.
          </p>
        </div>

        <div className="features-grid">
          <FeatureCard
            icon="📸"
            title="Instant Analysis"
            desc="Snap a photo or type what you ate. Our AI identifies ingredients and nutritional value instantly."
          />
          <FeatureCard
            icon="🎤"
            title="Voice Input"
            desc="Just say what you had for lunch. We convert your speech to structured nutrition data."
          />
          <FeatureCard
            icon="🩺"
            title="Health Warnings"
            desc="Get real-time alerts if a meal conflicts with your conditions like Diabetes or High BP."
          />
          <FeatureCard
            icon="📊"
            title="Smart Insights"
            desc="Visualize your daily intake with beautiful charts and get personalized recommendations."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="steps-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
        </div>
        <div className="steps-grid">
          <Step
            number="01"
            title="Create Profile"
            desc="Tell us about your health conditions and goals."
          />
          <Step
            number="02"
            title="Log Food"
            desc="Type, speak, or scan your meal details."
          />
          <Step
            number="03"
            title="Get Insights"
            desc="Receive instant nutritional breakdown and health alerts."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">NUTRILENS 🥗</div>
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact</span>
        </div>
        <p className="footer-copy">© 2026 Nutrilens. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Sub-components defined in the same file for simplicity
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <span className="feature-icon">{icon}</span>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="step-card">
      <div className="step-number">{number}</div>
      <div className="step-content">
        <h3 className="step-title">{title}</h3>
        <p className="feature-desc">{desc}</p>
      </div>
    </div>
  );
}
