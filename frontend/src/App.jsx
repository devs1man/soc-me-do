import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Discover from "./pages/Discover";
import Watchlist from "./pages/Watchlist";
import EventPlanner from "./pages/EventtPlanner";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/event-planner" element={<EventPlanner />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
