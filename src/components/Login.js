import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const bg = "/bg2.jpg";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // success/error msg
  const [isError, setIsError] = useState(false); // error or success flag

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // reset before submit
    try {
      const res = await fetch("https://moodify-api-ol0l.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        console.log("User:", data.user);
        setIsError(false);
        setMessage("✅ Login successful!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setIsError(true);
        setMessage(data.errors ? data.errors[0].msg : data.msg);
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${bg})` }}>
      <div className="login-box">
        <h1 className="login-title">Login</h1>

        {message && (
          <p className={`login-message ${isError ? "error" : "success"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">Log in</button>

          <div className="login-footer">
            <p className="forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </p>
            <p className="signup-link">
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
