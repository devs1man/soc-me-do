// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // optional if you want custom navbar styles

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">🎬 Movie Night Planner</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/discover">Discover</Link></li>
        <li><Link to="/watchlist">Watchlist</Link></li>
        <li><Link to="/event-planner">Plan Event</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
