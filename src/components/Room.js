import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../styles/Room.css";

const socket = io("https://backend-production-7b07.up.railway.app"); // change port if different

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
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const chatEndRef = useRef(null);

  // Redirect if mood not selected
  useEffect(() => {
    if (!mood) navigate("/joinroom");
  }, [mood, navigate]);

  // Scroll chat to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket setup
  useEffect(() => {
    if (!mood) return;
    socket.emit("joinRoom", mood);

    socket.on("newSong", (songData) => {
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

  // Play song from backend timestamp
  const playFromTimestamp = (songData) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    audio.src = `https://backend-production-7b07.up.railway.app${songData.url}`;
    audio.currentTime = Math.max((Date.now() - new Date(songData.startTime).getTime()) / 1000, 0);
    audio.play().catch((err) => console.log("Autoplay blocked:", err));
  };

  // Update progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && song) {
        setProgress(audioRef.current.currentTime);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [song]);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("sendMessage", {
      mood,
      message: input,
      username, // send real username
    });

    setInput(""); // clear input
  };

  return (
    <div className="room-container" style={{ backgroundImage: `url(${bg})` }}>
      <div className="room-box">
        {/* Music Player */}
        <div className="music-player">
          <h2>
            {mood === "happy" ? "😊"
              : mood === "chill" ? "😎"
                : mood === "sad" ? "😔"
                  : ""}{" "}
            {mood.charAt(0).toUpperCase() + mood.slice(1)} Room
          </h2>


          {song ? (
            <>
              <p>Now Playing: {song.name}</p>
              <audio ref={audioRef} controls={false} muted={isMuted} />
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !audioRef.current.muted;
                    setIsMuted(audioRef.current.muted);
                  }
                }}
              >
                {isMuted ? "Unmute" : "Mute"}
              </button>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: audioRef.current && audioRef.current.duration
                      ? `${(progress / audioRef.current.duration) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <p>
                {Math.floor(progress / 60)}:
                {("0" + Math.floor(progress % 60)).slice(-2)} /{" "}
                {audioRef.current
                  ? `${Math.floor(audioRef.current.duration / 60)}:${("0" + Math.floor(audioRef.current.duration % 60)).slice(-2)}`
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
