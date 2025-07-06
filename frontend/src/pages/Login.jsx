import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import tvAnim from "@/assets/Animation3.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  //for the login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  //register data
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  //calling backend to login
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email: loginEmail,
        password: loginPassword,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("loggedIn", "true");
      navigate("/");
    } catch (err) {
      console.log("login failed", err);
      alert(err.response?.data?.message || "login failed");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        name: regName,
        email: regEmail,
        password: regPassword,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("loggedIn", "true");
      navigate("/");
      navigate("/");
    } catch (err) {
      console.log("registration error", err.response?.data);
      alert(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#141e30] to-[#243b55] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-lg overflow-hidden">
        {/* Left: Animation */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-black bg-opacity-30">
          <Lottie animationData={tvAnim} loop className="w-[80%] h-[80%]" />
        </div>

        {/* Right: Tabs */}
        <div className="w-full md:w-1/2 bg-white/10 p-8 text-white backdrop-blur-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-black">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
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
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="bg-white text-black"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <Button
                  onClick={handleLogin}
                  className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-black border-white  hover:text-purple-600"
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
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  className="bg-white text-black"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="bg-white text-black"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
                <Button
                  onClick={handleRegister}
                  className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
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
