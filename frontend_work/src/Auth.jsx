import { useState } from "react";

export default function Auth() {
  const [mode, setMode] = useState("signin");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

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

  const sendOtp = () => {
    if (form.mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    alert(`Demo OTP: ${otp}`);
  };

  const signUp = () => {
    if (!form.username || !form.mobile || !form.password) {
      alert("Fill all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (form.otp !== generatedOtp) {
      alert("Invalid OTP");
      return;
    }
    alert("✅ Account created successfully");
  };

  const signIn = () => {
    if (!form.email || !form.password) {
      alert("Enter credentials");
      return;
    }
    alert("✅ Signed in");
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
              placeholder="Email or Mobile"
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
                Get OTP
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
