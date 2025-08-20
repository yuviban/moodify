import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

// Navbar.jsx
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Example: get user's name from localStorage or API
  const userName = "Yuvraj Singh"; 
  const firstLetter = userName.charAt(0).toUpperCase();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-left">
        <Link to="/" className="logo-link">
          <img src="/spotify.png" alt="Logo Icon" className="logo-icon" />
          <span className="logo-text">Moodify</span>
        </Link>
      </div>

      {/* Links */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Join Room</Link>
        <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</Link>
      </div>

      {/* Profile Button */}
      <div className="nav-right">
        <button className="profile-button" onClick={toggleProfile}>
          <span className="profile-letter">{firstLetter}</span>
          <span className={`arrow ${profileOpen ? "up" : "down"}`}></span>
        </button>

        {profileOpen && (
          <div className="profile-dropdown">
            <Link to="/profile" className="dropdown-item">Profile</Link>
            <Link to="/settings" className="dropdown-item">Settings</Link>
            <Link to="/help" className="dropdown-item">Help</Link>
            <button onClick={handleLogout} className="dropdown-item">Log Out</button>
          </div>
        )}
      </div>

      {/* Hamburger */}
      <div className={`hamburger ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
