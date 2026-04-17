import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import "../styles/global.css";

const API = "https://nutrilens-backend-lqes.onrender.com";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPw, setIsForgotPw] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [loginError, setLoginError] = useState(""); // State for login errors

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "", // Used for signup
    identifier: "", // Used for login (Email/Mobile/User)
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.email || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }
    if (formData.mobile.length < 10) {
      alert("Please enter a valid mobile number");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    try {
      const resp = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          password: formData.password
        })
      });
      if (resp.ok) {
        alert("Account created successfully!");
        navigate("/health-profile"); // Force new users to fill profile
      } else {
        const err = await resp.json();
        alert(err.detail || "Signup failed");
      }
    } catch {
      alert("Network error. Please try again later.");
    }
  };

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    // In our new flow, we just sign up directly without OTP, since user wants OTP specifically for password reset
    // Or if we still want OTP for signup, it wasn't requested in backend API for signup. Let's just bypass the fake OTP step on signup
    handleSendOTP(e);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!formData.identifier || !formData.password) {
      setLoginError("Please enter both identifier and password");
      return;
    }

    try {
      const resp = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        localStorage.setItem("userCredentials", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");
        
        // Check if profile exists
        try {
          const profResp = await fetch(`${API}/user/profile/${data.user.id}`);
          if (profResp.ok) {
            navigate("/dashboard");
          } else {
            localStorage.setItem("isNewUser", "true");
            navigate("/health-profile");
          }
        } catch {
          navigate("/health-profile");
        }
      } else {
        const err = await resp.json();
        setLoginError(err.detail || "Login failed");
      }
    } catch {
      setLoginError("Network error. Please try again later.");
    }
  };

  const [resetStep, setResetStep] = useState(1); // 1: Send link, 2: Verify OTP & New Password
  const [resetData, setResetData] = useState({ identifier: "", otp: "", newPassword: "" });

  const handleForgotPw = async (e) => {
    e.preventDefault();
    if (resetStep === 1) {
      if (!resetData.identifier) return alert("Please enter identifier");
      const resp = await fetch(`${API}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: resetData.identifier })
      });
      const data = await resp.json();
      if (resp.ok) {
        alert(data.message || ` OTP sent to ${resetData.identifier}`);
        if (data.otp) {
          console.log("DEV OTP:", data.otp);
          alert("DEBUG OTP: " + data.otp);
        }
        setResetStep(2);
      } else {
        alert(data.detail || "Failed to send OTP");
      }
    } else {
      if (!resetData.otp || resetData.newPassword.length < 6) return alert("Invalid OTP or password too short");
      
      const verifyResp = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: resetData.identifier, otp: resetData.otp })
      });
      
      if (!verifyResp.ok) return alert("Invalid OTP");

      const resetResp = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: resetData.identifier, new_password: resetData.newPassword })
      });

      if (resetResp.ok) {
        alert("Password reset successfully!");
        setIsForgotPw(false);
        setResetStep(1);
      } else {
        alert("Failed to reset password");
      }
    }
  };

  

  // FORGOT PASSWORD VIEW
  if (isForgotPw) {
    return (
      <div className="auth-container">
        <div className="auth-overlay"></div>
        <div className="auth-card">
          <button
            className="back-to-login"
            onClick={() => { setIsForgotPw(false); setResetStep(1); }}
          >
            &larr; Back to Login
          </button>
          <div className="auth-header">
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">
              {resetStep === 1 ? "Enter your email  to receive a reset OTP." : "Enter OTP and your new password."}
            </p>
          </div>
          <form className="auth-form" onSubmit={handleForgotPw}>
            {resetStep === 1 ? (
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Enter your Email"
                  value={resetData.identifier}
                  onChange={(e) => setResetData({...resetData, identifier: e.target.value})}
                  required
                />
              </div>
            ) : (
              <>
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    className="auth-input"
                    type="text"
                    placeholder="Enter OTP"
                    value={resetData.otp}
                    onChange={(e) => setResetData({...resetData, otp: e.target.value})}
                    required
                  />
                </div>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="New Password"
                    value={resetData.newPassword}
                    onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                    required
                  />
                </div>
              </>
            )}
            <button type="submit" className="auth-btn">
              {resetStep === 1 ? "Send Reset OTP" : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-overlay"></div>

      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">NUTRILENS 🥗</span>
          <h2 className="auth-title">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="auth-subtitle">
            {isSignUp
              ? "Start your healthy journey today"
              : "Sign in to continue tracking"}
          </p>
        </div>

        {/* SIGN UP FORM */}
        {isSignUp ? (
          <form
            className="auth-form"
            onSubmit={showOTP ? handleVerifyAndSignup : handleSendOTP}
          >
            {!showOTP && (
              <>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    className="auth-input"
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    className="auth-input"
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    className="auth-input"
                    type="email"
                    name="email"
                    placeholder="Email Address (Optional)"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    className="auth-input"
                    type="password"
                    name="password"
                    placeholder="Create Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-wrapper">
                  <span className="input-icon">🔐</span>
                  <input
                    className="auth-input"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="auth-btn">
                  Create Account &rarr;
                </button>
              </>
            )}

            {showOTP && (
              <div className="otp-section">
                <label className="otp-label">
                  Enter OTP sent to {formData.mobile}
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    className="auth-input"
                    type="text"
                    name="otp"
                    placeholder="Ex: 1234"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    maxLength={4}
                    autoFocus
                  />
                </div>
                <button type="submit" className="auth-btn verify-btn">
                  Verify & Create Account ✨
                </button>
                <button
                  type="button"
                  onClick={() => setShowOTP(false)}
                  style={{
                    background: "none",
                    border: "none",
                    width: "100%",
                    marginTop: "10px",
                    color: "var(--gray)",
                    cursor: "pointer",
                  }}
                >
                  Change Number
                </button>
              </div>
            )}
          </form>
        ) : (
          /* LOGIN FORM */
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                className="auth-input"
                type="text"
                name="identifier"
                placeholder="Email / Mobile"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {loginError && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "0.85rem",
                  marginTop: "5px",
                  marginBottom: "0",
                  textAlign: "left",
                }}
              >
                {loginError}
              </p>
            )}

            <button
              type="button"
              className="forgot-pw-link"
              onClick={() => setIsForgotPw(true)}
            >
              Forgot Password?
            </button>

            <button type="submit" className="auth-btn">
              Sign In
            </button>
          </form>
        )}

        <div className="auth-footer">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            className="auth-link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setShowOTP(false);
              setFormData({ ...formData, otp: "" });
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
