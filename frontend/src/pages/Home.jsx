import React, { useEffect, useState } from "react";
import axios from "axios";
import { urls } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [trending, setTrending] = useState([]); // 🔄 Store trending movies
  const [selectedMovie, setSelectedMovie] = useState(null); // 🎬 Modal movie
  const [showDialog, setShowDialog] = useState(false); // 🔒 Login dialog state
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    localStorage.setItem("loggedIn", "true"); // IF wanting to check what happens when logged in
    const loggedIn = localStorage.getItem("loggedIn") === "true"; // check if loggedin is true or not
    setIsLoggedIn(loggedIn);
  }, []);

  const navigate = useNavigate();

  // 📡 Fetch trending movies on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(urls.trending);
        setTrending(res.data.results.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      }
    };
    fetchTrending();
  }, []);

  const handleProtectedRoute = (route) => {
    if (isLoggedIn) {
      navigate(route);
    } else {
      setShowDialog(true);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/assests/home.jpg')" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 🧭 Navbar with login-aware route protection */}
      <header className="flex justify-between items-center px-6 py-4 bg-black/70 backdrop-blur-sm shadow-md">
        <h1 className="text-2xl font-bold">🍿 Movie Night</h1>
        <nav className="flex gap-6 items-center text-base">
          {[
            { label: "Home", route: "/home" },
            { label: "Discover", route: "/discover" },
            { label: "Watchlist", route: "/watchlist" },
            { label: "Planner", route: "/planner" },
          ].map(({ label, route }) => (
            <button
              key={label}
              onClick={() => handleProtectedRoute(route)}
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
                      setIsLoggedIn(false); // ✅ updates UI without refresh
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

      {/* 🦸‍♂️ Hero CTA Section */}
      <section className="text-center px-4 pt-20 pb-10 bg-black/60">
        <motion.h2
          className="text-4xl md:text-6xl font-extrabold drop-shadow-lg"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Plan Your Perfect Movie Night 🎬
        </motion.h2>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Discover trending films, create a watchlist, and vote with friends.
        </p>
        <Button
          className="mt-10 px-6 py-4 text-lg rounded-xl bg-yellow-500 hover:bg-yellow-400 transition-colors"
          onClick={() => handleProtectedRoute("/discover")}
        >
          Get Started →
        </Button>
      </section>

      {/* 🔥 Trending Movies Grid */}
      <section className="px-6 pt-8 pb-10 bg-black bg-opacity-80">
        <h3 className="text-3xl font-semibold mb-6 text-center">
          🔥 Trending This Week
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {trending.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.05 }}
              className="relative min-w-[150px] max-w-[150px] cursor-pointer"
              onClick={() => {
                if (!isLoggedIn) {
                  setShowDialog(true);
                } else {
                  setSelectedMovie(movie);
                }
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg shadow-md"
              />
              <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-0.5 text-xs font-bold rounded">
                ⭐ {movie.vote_average.toFixed(1)}
              </div>
              <p className="mt-2 text-sm text-center">{movie.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💡 Feature Highlights (now interactive) */}
      <section className="py-16 px-6 bg-[#141414]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: "🎬",
              title: "Discover",
              route: "/discover",
              desc: "Find trending OTT films",
            },
            {
              icon: "✅",
              title: "Watchlist",
              route: "/watchlist",
              desc: "Save and organize picks",
            },
            {
              icon: "🗳️",
              title: "Vote",
              route: "/planner",
              desc: "Decide with your group",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white/10 rounded-xl shadow-md hover:bg-yellow-500/10 transition cursor-pointer"
              onClick={() => handleProtectedRoute(item.route)}
            >
              <h4 className="text-2xl mb-2">
                {item.icon} {item.title}
              </h4>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🎬 Movie Description Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedMovie(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1a1a1a] text-white rounded-xl p-6 max-w-4xl w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-3 text-2xl text-white"
                onClick={() => setSelectedMovie(null)}
              >
                &times;
              </button>
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={
                    "https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}"
                  }
                  alt={selectedMovie.title}
                  className="w-full md:w-1/3 rounded-lg"
                />
                <div className="flex-1 space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-400">
                    {selectedMovie.title}
                  </h2>
                  <p>{selectedMovie.overview || "No description available."}</p>
                  <p className="text-sm text-yellow-400">
                    ⭐ {selectedMovie.vote_average?.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-400">
                    📅 {selectedMovie.release_date}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔒 Login Required Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-black text-white border-white max-w-sm">
          <DialogTitle>Please Login</DialogTitle>
          <DialogDescription className="text-gray-300">
            You need to login to use this feature.
          </DialogDescription>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              className="text-black"
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600"
              onClick={() => navigate("/login")}
            >
              Login Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Home;
