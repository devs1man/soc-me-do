import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import OTTSection from "../components/OTTSection"; // Make sure this path is correct

function Home() {
  return (
    <div className="home-wrapper">
      <div className="intro-card">
        <h1>🎬 Movie Night Planner</h1>
        <p>Plan the perfect movie night with your gang!</p>
        <div className="buttons">
          <Link to="/discover" className="discover-btn">
            Discover Movies
          </Link>
          <Link to="/watchlist" className="watchlist-btn">
            Create Watchlist
          </Link>
        </div>
      </div>

      {/* OTT Sections */}
      <OTTSection providerId="8" platform="Netflix" />
      <OTTSection providerId="119" platform="Prime Video" />
      <OTTSection providerId="122" platform="Hotstar" />
    </div>
  );
}

export default Home;
