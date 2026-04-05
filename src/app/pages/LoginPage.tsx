import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { motion } from "motion/react";
import logo from "../components/img/logo.png";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const defaultTab = searchParams.get("tab") === "organization" ? "organization" : "donor";

  const handleDonorLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'donor' }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert(err.error || 'Login failed');
        return;
      }
      const result = await response.json();
      // store simple session in localStorage for demo
      try { localStorage.setItem('glassbox_user', JSON.stringify(result)); } catch {}
      // full page navigation to avoid dev HMR unmount issues
      window.location.assign('/donor');
    } catch (error) {
      console.error("Failed to fetch from backend:", error);
      alert("Could not connect to backend!");
    }
  };

  const handleOrgLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'org' }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert(err.error || 'Login failed');
        return;
      }
      const result = await response.json();
      try { localStorage.setItem('glassbox_user', JSON.stringify(result)); } catch {}
      window.location.assign('/organization');
    } catch (error) {
      console.error("Failed to fetch from backend:", error);
      alert("Could not connect to backend!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 flex flex-col relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ y: -100, x: Math.random() * window.innerWidth }}
            animate={{
              y: [null, window.innerHeight + 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 3,
              ease: "linear",
            }}
          >
            {i % 2 === 0 ? (
              <Heart className="w-12 h-12 text-pink-400" fill="currentColor" />
            ) : (
              <Sparkles className="w-10 h-10 text-rose-400" />
            )}
          </motion.div>
        ))}
      </div>
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b border-pink-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.05 }}
          >
            <img src={logo} alt="Glassbox Logo" className="w-10 h-10" />
            <span className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Glassbox</span>
          </motion.button>
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="gap-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <motion.h1
              className="text-3xl font-bold text-slate-900 mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Welcome Back
            </motion.h1>
            <motion.p
              className="text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Sign in to access your dashboard
            </motion.p>
          </div>

          <motion.div
            className="bg-white rounded-3xl border border-pink-100 shadow-2xl shadow-pink-200/50 p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ boxShadow: "0 30px 60px rgba(251, 207, 232, 0.4)" }}
          >
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-pink-50 p-1 rounded-xl">
                <TabsTrigger value="donor" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md">Donor</TabsTrigger>
                <TabsTrigger value="organization" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md">Organization</TabsTrigger>
              </TabsList>

              <TabsContent value="donor">
                <form onSubmit={handleDonorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="donor-email" className="text-slate-700">Email</Label>
                    <Input
                      id="donor-email"
                      type="email"
                      placeholder="donor@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="donor-password" className="text-slate-700">Password</Label>
                    <Input
                      id="donor-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 rounded-xl shadow-lg shadow-pink-200">
                    Sign In as Donor
                  </Button>
                  <p className="text-sm text-center text-slate-600">
                    Demo: Use any email/password to login
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="organization">
                <form onSubmit={handleOrgLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-email" className="text-slate-700">Organization Email</Label>
                    <Input
                      id="org-email"
                      type="email"
                      placeholder="admin@nonprofit.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-password" className="text-slate-700">Password</Label>
                    <Input
                      id="org-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 rounded-xl shadow-lg shadow-pink-200">
                    Sign In as Organization
                  </Button>
                  <p className="text-sm text-center text-slate-600">
                    Demo: Use any email/password to login
                  </p>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-pink-100 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <button className="text-pink-600 hover:text-pink-700 hover:underline font-medium">
                  Sign up
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
