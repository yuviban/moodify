import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../styles/Room.css";

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
  const [isMuted, setIsMuted] = useState(true); // start muted for autoplay
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

  // Play song with limited seek to 5 seconds
  const playFromTimestamp = (songData) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const backendURL = "https://moodify-api-ol0l.onrender.com";
    const songURL = `${backendURL}${encodeURI(songData.url)}`;
    audio.src = songURL;

    // Debug logs
    console.log("Audio ref after setting src:", audioRef.current);
    console.log("Audio src set to:", audio.src);

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);

      // Limit seek to max 5 seconds to avoid buffering delay
      const elapsed = (Date.now() - new Date(songData.startTime).getTime()) / 1000;
      audio.currentTime = Math.min(elapsed, 5);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Autoplay blocked, waiting for user interaction:", err);
        });
      }
    };
  };

  // Progress updater with console logs
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && song) {
        setProgress(audioRef.current.currentTime);
        console.log("Audio currentTime:", audioRef.current.currentTime);
        console.log("Audio src:", audioRef.current.src);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [song]);

  // First click anywhere un-mutes audio for autoplay
  useEffect(() => {
    const handleFirstClick = () => {
      if (audioRef.current) {
        audioRef.current.muted = false;
        setIsMuted(false);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => console.log("Error playing on first click:", err));
        }
      }
      document.removeEventListener("click", handleFirstClick);
    };
    document.addEventListener("click", handleFirstClick);
    return () => document.removeEventListener("click", handleFirstClick);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("sendMessage", {
      mood,
      message: input,
      username,
    });

    setInput("");
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
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
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
