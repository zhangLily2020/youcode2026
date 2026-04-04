import { useState } from "react";
import { useNavigate } from "react-router";
import { BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDonorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - navigate to donor dashboard
    navigate("/donor");
  };

  const handleOrgLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - navigate to org dashboard
    navigate("/organization");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-pink-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Tracer</span>
          </button>
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
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600">
              Sign in to access your dashboard
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-pink-100 shadow-2xl shadow-pink-200/50 p-8">
            <Tabs defaultValue="donor" className="w-full">
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
          </div>
        </div>
      </div>
    </div>
  );
}
