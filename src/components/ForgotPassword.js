import React from "react";
import { Link } from "react-router-dom";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  return (
    <div className="forgot-container" style={{ backgroundImage: `url("/bg2.jpg")` }}>
      
      <div className="forgot-box">
        <h1 className="forgot-title">Forgot Password</h1>
        <p className="forgot-desc">Enter your email to reset your password.</p>

        <input
          type="email"
          placeholder="Email"
          className="forgot-input"
        />

        <button className="forgot-button">Send Reset Link</button>

        <div className="forgot-footer">
          <p>
            Remembered your password? <Link to="/">Login</Link>
          </p>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
