// src/pages/Profile.jsx

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import axios from "axios";

const presetAvatars = [
  "https://github.com/shadcn.png",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=12",
];

export default function Profile() {
  const [user, setUser] = useState(null);

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    avatar: false,
  });
  const [editForm, setEditForm] = useState(user);
  const [favouriteMovies, setFavouriteMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.user?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${storedUser.user.id}/profile`,
          {
            headers: {
              Authorization: `Bearer ${storedUser.token}`,
            },
          }
        );
        setUser(res.data);

        const TMDB_API_KEY = "ee72e28ae1c38a2417af9c80095f2141";

        const fetchMovies = async (movieIds) => {
          const requests = movieIds.map((m) =>
            axios.get(
              `http://api.themoviedb.org/3/movie/${m.id}?api_key=${TMDB_API_KEY}`
            )
          );
          const responses = await Promise.all(requests);
          return responses.map((res) => res.data);
        };
        setUser(res.data);
        setEditForm(res.data);
        if (res.data.favourites?.length) {
          const favDetails = await fetchMovies(res.data.favourites);
          setFavouriteMovies(favDetails);
        }
        if (res.data.watchlist?.length) {
          const watchDetails = await fetchMovies(res.data.watchlist);
          setWatchlistMovies(watchDetails);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  const handleEditClick = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
  };

  const handleCancel = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    setEditForm((prev) => ({ ...prev, [field]: user[field] }));
  };

  const handleChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleChange("avatar", reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (field) => {
    setUser((prev) => ({ ...prev, [field]: editForm[field] }));
    setEditMode((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[url('/assests/home.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 -z-10 bg-black/70 backdrop-blur-sm" />

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center h-14 px-6 bg-black/70 backdrop-blur border-b border-zinc-800">
        <h1 className="text-yellow-400 text-xl font-bold">🎬 Movie Night</h1>
      </div>

      <div className="pt-24 pb-16 relative z-10">
        <div className="mx-auto max-w-3xl bg-black backdrop-blur-md rounded-2xl border border-yellow-400 p-6 flex flex-col items-center space-y-4 shadow-xl">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-yellow-400">
              <AvatarImage src={editForm.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => handleEditClick("avatar")}
              className="absolute -bottom-2 -right-2 bg-yellow-400 text-black p-1 rounded-full"
            >
              <Pencil size={16} />
            </button>
          </div>

          {/* Avatar Editing Options */}
          {editMode.avatar && (
            <div className="text-center space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
              <div className="flex gap-2 justify-center flex-wrap">
                {presetAvatars.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="avatar"
                    onClick={() => handleChange("avatar", url)}
                    className="w-12 h-12 rounded-full cursor-pointer border-2 hover:border-yellow-400"
                  />
                ))}
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => handleSave("avatar")}
                  className="bg-yellow-400 text-black"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCancel("avatar")}
                  className="text-black"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Name */}
          <div className="text-center flex items-center gap-2">
            {editMode.name ? (
              <>
                <Input
                  value={editForm.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="text-center w-48"
                />
                <Button
                  size="sm"
                  onClick={() => handleSave("name")}
                  className="bg-yellow-400 text-black"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancel("name")}
                  className="text-black"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-3xl text-yellow-400 font-semibold">
                  {user.name}
                </h2>
                <button
                  onClick={() => handleEditClick("name")}
                  className="text-yellow-400"
                >
                  <Pencil size={16} />
                </button>
              </>
            )}
          </div>

          {/* Email */}
          <div className="text-center flex items-center gap-2">
            {editMode.email ? (
              <>
                <Input
                  value={editForm.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="text-center w-64"
                />
                <Button
                  size="sm"
                  onClick={() => handleSave("email")}
                  className="bg-yellow-400 text-black"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancel("email")}
                  className="text-black"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <p className="text-l text-zinc-400">{user.email}</p>
                <button
                  onClick={() => handleEditClick("email")}
                  className="text-yellow-400"
                >
                  <Pencil size={16} />
                </button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex space-x-6 text-center">
            <div>
              <p className="text-yellow-400 text-lg font-bold">
                {user.watchlistCount}
              </p>
              <p className="text-sm text-zinc-400">Watchlist</p>
            </div>
            <div>
              <p className="text-yellow-400 text-lg font-bold">
                {user.favouritesCount}
              </p>
              <p className="text-sm text-zinc-400">Favourites</p>
            </div>
          </div>

          <Button variant="destructive" className="bg-red-600 text-white">
            🚪 Logout
          </Button>
        </div>

        {/* Tabs Section */}
        <div className="mt-10 max-w-4xl mx-auto px-4">
          <Tabs defaultValue="favs" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-800 border border-zinc-700 rounded-full">
              <TabsTrigger value="favs">⭐ Favourites</TabsTrigger>
              <TabsTrigger value="watch">👁 Watchlist</TabsTrigger>
              <TabsTrigger value="reviews">📝 Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="favs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {favouriteMovies.length === 0 ? (
                  <p className="text-zinc-400">No favourites added yet.</p>
                ) : (
                  favouriteMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="bg-zinc-900 p-2 rounded-lg shadow-md"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="rounded-lg w-full"
                      />
                      <h3 className="text-white mt-2 text-center text-sm">
                        {movie.title}
                      </h3>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="watch">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {watchlistMovies.length === 0 ? (
                  <p className="text-zinc-400">No watchlist movies yet.</p>
                ) : (
                  watchlistMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="bg-zinc-900 p-2 rounded-lg shadow-md"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="rounded-lg w-full"
                      />
                      <h3 className="text-white mt-2 text-center text-sm">
                        {movie.title}
                      </h3>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              {/* same content as before */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
