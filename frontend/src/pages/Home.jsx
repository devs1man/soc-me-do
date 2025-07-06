import React, { useEffect, useState } from "react";
import axios from "axios";
import { urls } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = token !== null;
  const [trending, setTrending] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [selectedTrailerKey, setSelectedTrailerKey] = useState(null);
  const [trailerError, setTrailerError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(urls.trending);
        setTrending(res.data.results.slice(0, 10));
        setTimeout(() => setAnimationTrigger(true), 100);
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      }
    };
    fetchTrending();
  }, []);

  return (
    <motion.div
      className="relative min-h-screen bg-black text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/assests/home.jpg')" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10"></div>

      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-black/70 backdrop-blur-sm shadow-md">
        <h1 className="text-2xl font-bold">🍿 Movie Night</h1>
        <nav className="flex gap-6 items-center text-base">
          {["Home", "Discover", "Watchlist", "Planner"].map((label) => (
            <button
              key={label}
              className="hover:text-yellow-400 transition-colors duration-200 bg-transparent border-none outline-none"
              onClick={() => {
                if (label === "Home") {
                  navigate("/");
                } else if (!isLoggedIn) {
                  setShowDialog(true);
                } else {
                  navigate(`/${label.toLowerCase()}`);
                }
              }}
            >
              {label}
            </button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger>
              {user ? (
                <div className="w-8 h-8 bg-yellow-500 text-white font-bold rounded-full shadow flex items-center justify-center uppercase">
                  {user.name.charAt(0)}
                </div>
              ) : (
                <div className="w-8 h-8 bg-black rounded-full shadow cursor-pointer"></div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black ">
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                className="hover:bg-yellow-100"
              >
                Logged in as <strong className="ml-1">{user.name}</strong>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/login")}
                className="hover:bg-yellow-100"
              >
                Logout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/groups/my-groups")}
                className="hover:bg-black-100"
              >
                Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>

      {/* Hero Section */}
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
        {isLoggedIn ? (
          <h3 className="mt-10 text-4xl font-extrabold text-yellow-500 drop-shadow-md">
            Welcome {user?.name?.split(" ")[0]}!🙌
          </h3>
        ) : (
          <Button
            className="mt-10 px-6 py-4 text-lg rounded-xl bg-yellow-500 hover:bg-yellow-400 transition-colors"
            onClick={() => setShowDialog(true)}
          >
            Get Started →
          </Button>
        )}
      </section>

      {/* Trending Movies */}
      <section className="px-6 pt-8 pb-10 bg-black bg-opacity-80">
        <h3 className="text-3xl font-semibold mb-6 text-center">
          🔥 Trending This Week
        </h3>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-10 max-w-6xl mx-auto my-6"
          initial="hidden"
          animate={animationTrigger ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.15 },
            },
            hidden: {},
          }}
        >
          {trending.map((movie) => (
            <HoverCard key={movie.id}>
              <HoverCardTrigger asChild>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative min-w-[180px] max-w-[180px] md:min-w-[220px] md:max-w-[220px] cursor-pointer"
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
              </HoverCardTrigger>
              <HoverCardContent
                className="bg-black text-white border border-yellow-400 p-4 w-64"
                sideOffset={8}
              >
                <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-5">
                  {movie.overview || "No description available."}
                </p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-[#141414]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: "🎬", title: "Discover", desc: "Find trending OTT films" },
            { icon: "✅", title: "Watchlist", desc: "Save and organize picks" },
            { icon: "🗳️", title: "Vote", desc: "Decide with your group" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white/10 rounded-xl shadow-md hover:bg-yellow-500/10 transition"
            >
              <h4 className="text-2xl mb-2">
                {item.icon} {item.title}
              </h4>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Movie Description Modal */}
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
              className="bg-[#1a1a1a] text-white rounded-xl p-6 max-w-xl w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-3 text-2xl text-white"
                onClick={() => setSelectedMovie(null)}
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold mb-4">{selectedMovie.title}</h2>
              <p className="text-yellow-400 font-medium mb-2">
                ⭐ Rating: {selectedMovie.vote_average.toFixed(1)} / 10
              </p>
              <p className="text-gray-300 text-sm mb-2">
                {selectedMovie.overview || "No description available."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Dialog */}
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
