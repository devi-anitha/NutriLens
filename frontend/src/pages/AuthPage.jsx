import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import "../styles/global.css";

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

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!formData.mobile || formData.mobile.length < 10) {
      alert("Please enter a valid mobile number");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setShowOTP(true);
      alert(`OTP sent to ${formData.mobile}: 1234`); // Mock OTP
    }, 1000);
  };

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    if (formData.otp !== "1234") {
      alert("Invalid OTP! (Try 1234)");
      return;
    }
    // Store user credentials for login validation
    const userCredentials = {
      mobile: formData.mobile,
      email: formData.email,
      password: formData.password,
      name: formData.name,
    };
    localStorage.setItem("userCredentials", JSON.stringify(userCredentials));

    completeAuth(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError(""); // Clear previous errors

    const savedCreds = localStorage.getItem("userCredentials");
    if (!savedCreds) {
      setLoginError("No account found. Please sign up first.");
      return;
    }

    const user = JSON.parse(savedCreds);
    const inputId = formData.identifier;
    const inputPass = formData.password;

    // Check if identifier matches email, mobile, or name (simple check)
    const isIdMatch =
      inputId === user.mobile ||
      inputId === user.email ||
      inputId === user.name;
    const isPassMatch = inputPass === user.password;

    if (!isIdMatch || !isPassMatch) {
      setLoginError("Incorrect username or password");
      return;
    }

    completeAuth(false);
  };

  const handleForgotPw = (e) => {
    e.preventDefault();
    alert("Reset link sent to " + formData.identifier);
    setIsForgotPw(false);
  };

  const completeAuth = (isNewUser) => {
    localStorage.setItem("isLoggedIn", "true");
    if (isNewUser) localStorage.setItem("isNewUser", "true");
    navigate("/health-profile");
  };

  // FORGOT PASSWORD VIEW
  if (isForgotPw) {
    return (
      <div className="auth-container">
        <div className="auth-overlay"></div>
        <div className="auth-card">
          <button
            className="back-to-login"
            onClick={() => setIsForgotPw(false)}
          >
            &larr; Back to Login
          </button>
          <div className="auth-header">
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">
              Enter your email or mobile number to receive a reset link.
            </p>
          </div>
          <form className="auth-form" onSubmit={handleForgotPw}>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                className="auth-input"
                type="text"
                name="identifier"
                placeholder="Email or Mobile Number"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="auth-btn">
              Send Reset Link
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
                  Send OTP &rarr;
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
                placeholder="Email / Mobile / Username"
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
