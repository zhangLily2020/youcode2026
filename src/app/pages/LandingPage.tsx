import React from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Eye, Shield, Heart, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";
import { getCategoryDisplay } from "../constants/expenseCategories";

const LANDING_IMPACT_ROWS = [
  {
    categoryValue: "Education & Supplies",
    title: "School Supplies",
    subtitle: "Riverside Elementary",
    amount: "$500",
    amountClass: "text-pink-600",
    rowBg: "from-pink-50 to-rose-50",
  },
  {
    categoryValue: "Food & Nutrition",
    title: "Food Program",
    subtitle: "Community Kitchen",
    amount: "$450",
    amountClass: "text-rose-600",
    rowBg: "from-rose-50 to-orange-50",
  },
  {
    categoryValue: "Medical & Health",
    title: "Medical Supplies",
    subtitle: "St. Mary's Hospital",
    amount: "$300",
    amountClass: "text-orange-600",
    rowBg: "from-orange-50 to-amber-50",
  },
] as const;

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    {children}
  </motion.div>
);

const RotatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ rotate: 0 }}
    animate={{ rotate: [0, 10, -10, 0] }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    {children}
  </motion.div>
);

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingElement delay={0}>
          <div className="absolute top-20 left-10 text-pink-300 opacity-40">
            <Heart className="w-16 h-16" fill="currentColor" />
          </div>
        </FloatingElement>

        <FloatingElement delay={0.5}>
          <div className="absolute top-40 right-20 text-rose-300 opacity-30">
            <Sparkles className="w-12 h-12" />
          </div>
        </FloatingElement>

        <RotatingElement delay={1}>
          <div className="absolute bottom-40 left-1/4 text-orange-300 opacity-30">
            <TrendingUp className="w-20 h-20" />
          </div>
        </RotatingElement>

        <FloatingElement delay={1.5}>
          <div className="absolute top-1/3 right-1/4 text-pink-200 opacity-50">
            <Heart className="w-10 h-10" fill="currentColor" />
          </div>
        </FloatingElement>

        <FloatingElement delay={2}>
          <div className="absolute bottom-20 right-10 text-rose-200 opacity-40">
            <Sparkles className="w-14 h-14" />
          </div>
        </FloatingElement>

        <RotatingElement delay={0.3}>
          <div className="absolute top-1/2 left-10 text-orange-200 opacity-30">
            <Heart className="w-12 h-12" fill="currentColor" />
          </div>
        </RotatingElement>
      </div>
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b border-pink-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </motion.div>
            <span className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Glassbox</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate("/login")}
              className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 rounded-xl shadow-lg shadow-pink-200"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h1
            className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Know where your
            <br />
            <motion.span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent inline-block">
              donations go
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-lg text-slate-600 mb-10 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            See receipts, track spending, watch your impact grow.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 rounded-xl shadow-lg shadow-pink-200"
              >
                Start Donating
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/login?tab=organization")}
                variant="outline"
                size="lg"
                className="rounded-xl border-2 border-pink-200 text-pink-700 hover:bg-pink-50"
              >
                I&apos;m an Organization
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Dashboard preview */}
        <motion.div
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl shadow-pink-200/30 border border-pink-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Total Donated</p>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    $1,250
                  </h2>
                </div>
                <div className="text-sm text-slate-600 bg-pink-50 px-4 py-2 rounded-xl">
                  Last 6 months
                </div>
              </div>

              <div className="space-y-3">
                {LANDING_IMPACT_ROWS.map((row) => {
                  const disp = getCategoryDisplay(row.categoryValue);
                  const Icon = disp.Icon;
                  return (
                    <div
                      key={row.categoryValue}
                      className={`bg-gradient-to-r ${row.rowBg} rounded-2xl p-4 flex items-center justify-between gap-4`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 shrink-0 bg-gradient-to-br ${disp.gradient} rounded-xl flex items-center justify-center shadow-sm`}
                        >
                          <Icon className="w-5 h-5 text-white" aria-hidden />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="font-medium text-slate-900">{row.title}</p>
                          <p className="text-sm text-slate-600">{row.subtitle}</p>
                        </div>
                      </div>
                      <p className={`text-lg font-semibold shrink-0 ${row.amountClass}`}>{row.amount}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Value props */}
        <motion.div
          className="mt-24 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="text-center">
            <div className="text-pink-600 mb-3">
              <Eye className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Full visibility</h3>
            <p className="text-sm text-slate-600">Every receipt, every dollar</p>
          </div>

          <div className="text-center">
            <div className="text-rose-600 mb-3">
              <TrendingUp className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Real impact</h3>
            <p className="text-sm text-slate-600">Track what actually happens</p>
          </div>

          <div className="text-center">
            <div className="text-orange-600 mb-3">
              <Shield className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Built on trust</h3>
            <p className="text-sm text-slate-600">No guesswork, just facts</p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-pink-100 mt-24 py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600">
          <p>&copy; 2026 Glassbox. Building trust through transparency.</p>
        </div>
      </footer>
    </div>
  );
}
