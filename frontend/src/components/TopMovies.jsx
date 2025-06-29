import React, { useEffect, useState } from "react";
import "./TopMovies.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function TopMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results.slice(0, 6)); // Take top 6 movies
      })
      .catch((err) => console.error("Failed to fetch movies", err));
  }, []);

  return (
    <div className="top-movies">
      <h2>🔥 Trending This Week</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopMovies;
