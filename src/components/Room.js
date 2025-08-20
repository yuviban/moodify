import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../styles/Room.css";

// Connect to backend
const socket = io("https://moodify-api-ol0l.onrender.com");

const Room = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mood = location.state?.mood;
  const username = localStorage.getItem("username") || "Guest";
  const bg = "/bg8.jpg";

  const [song, setSong] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const chatEndRef = useRef(null);

  // Redirect if mood not selected
  useEffect(() => {
    if (!mood) navigate("/joinroom");
  }, [mood, navigate]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket setup
  useEffect(() => {
    if (!mood) return;
    socket.emit("joinRoom", mood);

    socket.on("newSong", (songData) => {
      console.log("Received new song:", songData);
      setSong(songData);
      playFromTimestamp(songData);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("newSong");
      socket.off("receiveMessage");
    };
  }, [mood]);

  // Play song with encoding and autoplay-safe
  const playFromTimestamp = (songData) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const backendURL = "https://moodify-api-ol0l.onrender.com";
    const songURL = `${backendURL}${encodeURI(songData.url)}`;
    audio.src = songURL;

    // Debug: log audio ref and src
    console.log("Audio ref after setting src:", audioRef.current);
    console.log("Audio src set to:", audio.src);

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);

      // Calculate elapsed time from song startTime
      const elapsed = (Date.now() - new Date(songData.startTime).getTime()) / 1000;
      audio.currentTime = Math.max(elapsed, 0);

      // Try to play (may be blocked)
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Autoplay blocked, wait for user interaction:", err);
        });
      }
    };
  };

  // Update progress and debug audio
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && song) {
        setProgress(audioRef.current.currentTime);

        // Debug: log audio ref and current src
        console.log("Audio ref during progress update:", audioRef.current);
        console.log("Audio current src:", audioRef.current.src);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [song]);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("sendMessage", {
      mood,
      message: input,
      username,
    });

    setInput("");
  };

  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);

    // Play audio if unmuted
    if (!audioRef.current.muted) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Play error after unmute:", err);
        });
      }
    }
  };

  return (
    <div className="room-container" style={{ backgroundImage: `url(${bg})` }}>
      <div className="room-box">
        {/* Music Player */}
        <div className="music-player">
          <h2>
            {mood === "happy" ? "😊" : mood === "chill" ? "😎" : mood === "sad" ? "😔" : ""}{" "}
            {mood.charAt(0).toUpperCase() + mood.slice(1)} Room
          </h2>

          {song ? (
            <>
              <p>Now Playing: {song.name}</p>
              <audio ref={audioRef} controls={false} muted={isMuted} />
              <button onClick={handleMuteToggle}>
                {isMuted ? "Unmute" : "Mute"}
              </button>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: duration ? `${(progress / duration) * 100}%` : "0%",
                  }}
                />
              </div>
              <p>
                {Math.floor(progress / 60)}:{("0" + Math.floor(progress % 60)).slice(-2)} /{" "}
                {duration
                  ? `${Math.floor(duration / 60)}:${("0" + Math.floor(duration % 60)).slice(-2)}`
                  : "0:00"}
              </p>
            </>
          ) : (
            <p>Loading song...</p>
          )}
        </div>

        {/* Chat Box */}
        <div className="chat-container">
          <h3>Chat</h3>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <p key={idx}>
                <strong>{msg.username}:</strong> {msg.message}
              </p>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
