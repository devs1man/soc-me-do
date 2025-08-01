import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import { urls } from "@/lib/api";

const genreOptions = [
  { label: "Action", value: "28" },
  { label: "Adventure", value: "12" },
  { label: "Animation", value: "16" },
  { label: "Comedy", value: "35" },
  { label: "Crime", value: "80" },
  { label: "Documentary", value: "99" },
  { label: "Drama", value: "18" },
  { label: "Family", value: "10751" },
  { label: "Fantasy", value: "14" },
  { label: "History", value: "36" },
  { label: "Horror", value: "27" },
  { label: "Music", value: "10402" },
  { label: "Mystery", value: "9648" },
  { label: "Romance", value: "10749" },
  { label: "Science Fiction", value: "878" },
  { label: "TV Movie", value: "10770" },
  { label: "Thriller", value: "53" },
  { label: "War", value: "10752" },
  { label: "Western", value: "37" },
];

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?.user?.id) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${storedUser.user.id}/profile`,
          {
            headers: {
              Authorization: `Bearer ${storedUser.token}`,
            },
          }
        );

        const movieIds = res.data.watchlist || [];
        const TMDB_API_KEY = "ee72e28ae1c38a2417af9c80095f2141";
        const requests = movieIds.map((tmdbId) =>
          axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`
          )
        );

        const movieData = await Promise.all(requests);
        setWatchlist(movieData.map((r) => r.data));
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error fetching watchlist", err);
      }
    };
  }, []);

  const removeWatchlist = async (movieId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/${storedUser.user.id}/watchlist`,
        { movie: { tmdbId: movieId } },
        {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        }
      );
      setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (err) {
      console.error("Failed to remove from watchlist", err);
    }
  };

  const handleMovieClick = async (movie) => {
    try {
      const providerRes = await axios.get(urls.watchProviders(movie.id));
      const providers = providerRes.data?.results?.IN?.flatrate || [];
      const ottNames = providers.map((p) => p.provider_name);
      setSelectedMovie({ ...movie, ott: ottNames });
    } catch {
      setSelectedMovie({ ...movie, ott: [] });
    }
  };

  const MovieCard = ({ movie, index }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { triggerOnce: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.07 }}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-xl overflow-hidden shadow-lg bg-black/60 cursor-pointer"
        onClick={() => handleMovieClick(movie)}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-auto object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold">{movie.title}</h3>
          <p className="text-yellow-400 text-sm">
            ⭐ {movie.vote_average?.toFixed(1)}
          </p>
        </div>
        <div className="flex justify-center mt-2 pb-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-yellow-400"
            onClick={(e) => {
              e.stopPropagation();
              removeWatchlist(movie.id);
            }}
          >
            👁️ Remove from Watchlist
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="min-h-screen text-white"
      style={{
        backgroundImage: "url('/assests/home.jpg')",
        backgroundSize: "100% auto",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-black/70 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/home")}
        >
          🍿 Movie Night
        </h1>
        <nav className="flex gap-6 items-center text-base">
          {[
            { label: "Home", route: "/home" },
            { label: "Discover", route: "/discover" },
            { label: "Watchlist", route: "/watchlist" },
            { label: "Favourites", route: "/favourite" },
            { label: "Planner", route: "/planner" },
          ].map(({ label, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className="hover:text-yellow-400 transition-colors duration-200"
            >
              {label}
            </button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-8 h-8 bg-white rounded-full shadow cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black">
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.setItem("loggedIn", "false");
                      setIsLoggedIn(false);
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate("/login")}>
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate("/login", { state: { tab: "register" } })
                    }
                  >
                    Register
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>

      <div className="px-6 py-10 min-h-screen bg-black/60">
        <h2 className="text-4xl font-bold text-center mb-10">
          👁️ Your Watchlist
        </h2>
        {watchlist.length === 0 ? (
          <p className="text-3xl text-gray-400 text-center mt-20">
            No movies added to watchlist
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8">
            {watchlist.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedMovie}
        onOpenChange={() => setSelectedMovie(null)}
      >
        <DialogContent className="max-w-4xl bg-zinc-900 text-white p-6 rounded-xl border-zinc-900">
          {selectedMovie && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl mb-2 text-yellow-400">
                  {selectedMovie.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-6">
                {selectedMovie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="w-full md:w-1/3 h-80 object-contain rounded-lg"
                  />
                )}
                <div className="space-y-4 md:w-2/3">
                  <p>{selectedMovie.overview || "No description available."}</p>
                  {selectedMovie.ott?.length > 0 ? (
                    <div className="mt-4">
                      <p className="font-bold text-3xl text-yellow-300 mb-1">
                        📺 Available On:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedMovie.ott.map((provider) => (
                          <li key={provider} className="text-white font-medium">
                            ✅ {provider}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-400 mt-4">
                      📵 No OTT info available
                    </p>
                  )}
                  <p className="text-3xl text-yellow-400">
                    ⭐ {selectedMovie.vote_average?.toFixed(1)}
                  </p>
                  <p className="text-l text-gray-400">
                    📅 {selectedMovie.release_date || "Unknown"}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedMovie.genre_ids?.map((id) => {
                      const genre = genreOptions.find(
                        (g) => g.value === String(id)
                      );
                      return (
                        <span
                          key={id}
                          className="px-2 py-1 rounded-full text-sm bg-yellow-600 text-black font-semibold"
                        >
                          {genre?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Watchlist;
