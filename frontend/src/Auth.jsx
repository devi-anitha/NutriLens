import { useState } from "react";

const API = "https://nutrilens-backend-lqes.onrender.com";

export default function Auth() {
  const [mode, setMode] = useState("signin");
  const [otpSent, setOtpSent] = useState(false);

  const [form, setForm] = useState({
    username: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ---------------- SEND OTP ----------------
  const sendOtp = async () => {
    try {
      const res = await fetch(`${API}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: form.email || form.mobile,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      setOtpSent(true);
      alert("OTP sent to your email");
    } catch (err) {
      alert(err.message);
    }
  };

  // ---------------- SIGN UP ----------------
  const signUp = async () => {
    console.log("NEW BUILD ACTIVE ✅");
    if (!form.username || !form.mobile || !form.email || !form.password) {
      alert("Fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // verify OTP
      const verifyRes = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: form.email,
          otp: form.otp,
        }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        throw new Error(err.detail);
      }

      // signup
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.username,
          mobile: form.mobile,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      alert("✅ Account created successfully");
      setMode("signin");

    } catch (err) {
      alert(err.message);
    }
  };

  // ---------------- SIGN IN (FIXED) ----------------
  const signIn = async () => {
  if (!form.email || !form.password) {
    alert("Enter credentials");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: form.email,
        password: form.password,
      }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();

    // 🔥 VERY IMPORTANT
    localStorage.setItem("userCredentials", JSON.stringify(data.user));

    alert("✅ Login successful");

    window.location.href = "/dashboard";

  } catch (err) {
    alert("Login failed");
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>NUTRILENS 🥗</h1>

        {mode === "signin" ? (
          <>
            <h3>Sign In</h3>

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              style={styles.input}
            />

            <button onClick={signIn} style={styles.primary}>
              Sign In
            </button>

            <p style={styles.link} onClick={() => setMode("signup")}>
              New user? Sign Up
            </p>
          </>
        ) : (
          <>
            <h3>Create Account</h3>

            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="mobile"
              placeholder="Mobile Number"
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="password"
              name="password"
              placeholder="Create Password"
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              style={styles.input}
            />

            {!otpSent ? (
              <button onClick={sendOtp} style={styles.secondary}>
                Send OTP
              </button>
            ) : (
              <input
                name="otp"
                placeholder="Enter OTP"
                onChange={handleChange}
                style={styles.input}
              />
            )}

            <button onClick={signUp} style={styles.primary}>
              Sign Up
            </button>

            <p style={styles.link} onClick={() => setMode("signin")}>
              Already have an account? Sign In
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg,#eafff3,#f6fffb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    padding: 40,
    borderRadius: 14,
    width: 380,
    boxShadow: "0 20px 40px rgba(0,0,0,.1)",
  },
  logo: { marginBottom: 10 },
  input: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  primary: {
    width: "100%",
    padding: 12,
    marginTop: 15,
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  secondary: {
    width: "100%",
    padding: 12,
    marginTop: 15,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#2563eb",
    cursor: "pointer",
  },
};