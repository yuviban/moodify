import React from "react";
import "../styles/About.css";
import { useNavigate } from "react-router-dom";

const About = () => {
  const bg = '/bg5.jpg';
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    navigate("/"); // assuming your join room route
  };

  return (
    <div 
      className="about-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="about-overlay"></div>

      <div className="about-content">
        <h1 className="about-title">About Moodify</h1>
        <p className="about-text">
          Moodify is your serene space to explore music that matches your mood. 
          Just like this tranquil island, we believe in calm, aesthetic, and beautiful experiences. 
          Dive into melodies that resonate with your feelings and let your mind wander.
        </p>
        <p className="about-text">
          Our platform allows you to connect with music, discover moods, and immerse yourself in a journey of sound and emotion. 
          Whether you want to chill, relax, or feel happy, Moodify makes your mood the center of everything.
        </p>
        <button className="join-room-btn" onClick={handleJoinRoom}>
          Join Room
        </button>
      </div>
    </div>
  );
};

export default About;
