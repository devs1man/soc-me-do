import React, { useEffect, useState } from "react";
import "./OTTSection.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function OTTSection({ providerId, platform }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchOTTMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_watch_providers=${providerId}&watch_region=IN&region=IN&sort_by=release_date.desc`
        );
        const data = await res.json();

        const filtered = data.results
          .filter((movie) => movie.poster_path) // no language filter
          .slice(0, 10);

        setMovies(filtered);
      } catch (err) {
        console.error(`Error fetching for ${platform}:`, err);
      }
    };

    fetchOTTMovies();
  }, [providerId, platform]);

  return (
    <div className="ott-section">
      <h2>🎬 Now Streaming on {platform}</h2>
      <div className="ott-grid">
        {movies.map((movie) => (
          <div className="ott-card" key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
            <h3>{movie.title}</h3>
            <p>📆 {movie.release_date || "Unknown"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OTTSection;
