import React, { useState, useEffect } from "react";
import "../styles/JoinRoom.css";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const navigate = useNavigate();
  const bg = "/bg4.jpg";
  const [selectedMood, setSelectedMood] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleJoin = () => {
    if (!selectedMood) {
      alert("Please select a mood!");
      return;
    }
    navigate("/room", { state: { mood: selectedMood.toLowerCase() } });
  };

  return (
    <div className="joinroom-container" style={{ backgroundImage: `url(${bg})` }}>
      <h1 className="joinroom-title">Mood-Sync Radio</h1>
      <p className="joinroom-subtitle">Listen to music that matches your mood</p>

      <div className="joinroom-box">
        <h2 className="joinroom-choose">Choose Your Mood</h2>
        <div className="mood-buttons">
          <button
            className={`mood-btn happy ${selectedMood === "Happy" ? "active" : ""}`}
            onClick={() => setSelectedMood("Happy")}
          >
            Happy
          </button>
          <button
            className={`mood-btn chill ${selectedMood === "Chill" ? "active" : ""}`}
            onClick={() => setSelectedMood("Chill")}
          >
            Chill
          </button>
          <button
            className={`mood-btn sad ${selectedMood === "Sad" ? "active" : ""}`}
            onClick={() => setSelectedMood("Sad")}
          >
            Sad
          </button>
        </div>
        <button className="joinroom-button" onClick={handleJoin}>
          Join Room
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
