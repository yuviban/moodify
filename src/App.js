import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import JoinRoom from "./components/JoinRoom";
import About from "./components/About";
import ContactUs from "./components/ContactUs";
import Room from "./components/Room";

// Wrapper component to conditionally show Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup", "/forgot-password"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<JoinRoom />} />
           <Route path="/room" element={<Room />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
