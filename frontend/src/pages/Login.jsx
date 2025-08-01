import React, { useState } from "react";
import Lottie from "lottie-react";
import tvAnim from "@/assets/Animation_black_gold";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [tab, setTab] = useState("Login");
  const navigate = useNavigate();
  const location = useLocation();
  const defaultTab = location.state?.tab || "login";

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        loginData
      );
      const { token, user } = res.data;
      console.log("Login response: ", user);
      localStorage.setItem("user", JSON.stringify({ token, user }));
      const profileRes = await axios.get(
        `http://localhost:5000/api/users/${user.id}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedUser = {
        token,
        user: profileRes.data,
      };
      localStorage.setItem("profile", JSON.stringify(profileRes.data));
      const userName = user.name;
      toast.success(`Welcome back, ${userName}!`, {
        style: {
          background: "#1a202c",
          color: "#facc15",
          border: "1px solid #facc15",
          fontSize: "16px",
          padding: "12px 20px",
          borderRadius: "10px",
        },
      });
      setLoginData({ email: "", password: "" });
      navigate("/home");
    } catch (err) {
      toast.error("Invalid credentials", err);
      console.log("login?", err);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });
      setRegisterData({ name: "", email: "", password: "" });
      setTab("Login");
      toast.success("Registration successful!", {
        autoClose: 5000,
        onClose: () => setTab("login"),
      });
    } catch (err) {
      if (err.response?.data?.message === "User already exists") {
        setRegisterData({ name: "", email: "", password: "" });
        setTab("Login");
        toast.info("User already exists.Please login.", {
          autoClose: 5000,
        });
      } else {
        toast.error("Something went wrong!");
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-lg overflow-hidden border border-yellow-500">
        {/* Left: Animation */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-black">
          <Lottie animationData={tvAnim} loop className="w-[80%] h-[80%]" />
        </div>

        {/* Right: Tabs */}
        <div className="w-full md:w-1/2 bg-black p-8 text-white">
          <Tabs defaultValue={defaultTab} className="w-full">
            {/* Tabs List */}
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-yellow-500 text-black rounded-lg">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-black data-[state=active]:text-yellow-400"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-black data-[state=active]:text-yellow-400"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className="bg-white text-black"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="bg-white text-black"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black transition-colors"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                >
                  Sign in with Google
                </Button>
              </motion.div>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <Input
                  placeholder="Name"
                  type="text"
                  className="bg-white text-black"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Email"
                  type="email"
                  className="bg-white text-black"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="bg-white text-black"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                />
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black transition-colors"
                  onClick={handleRegister}
                >
                  Create Account
                </Button>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
