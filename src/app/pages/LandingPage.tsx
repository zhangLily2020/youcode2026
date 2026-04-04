import { useNavigate } from "react-router";
import { ArrowRight, Eye, Shield, Heart, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";

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
      <nav className="border-b border-pink-100 bg-white/80 backdrop-blur-sm relative z-10">
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
            <span className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Tracer</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            className="text-5xl font-bold text-slate-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Track Every Dollar,
            <br />
            <motion.span
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              See Real Impact
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-xl text-slate-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A transparent platform connecting donors with non-profit organizations.
            Watch your donations transform into real-world change with detailed
            impact tracking and complete financial transparency.
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center"
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
                Get Started
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
                For Organizations
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            { icon: Eye, title: "Complete Transparency", desc: "See exactly where every dollar goes with detailed breakdowns and real-time tracking of organizational spending.", color: "from-pink-100 to-rose-100", iconColor: "text-pink-600", delay: 0 },
            { icon: TrendingUp, title: "Impact Metrics", desc: "Track measurable outcomes and see the direct impact of your contributions through comprehensive analytics.", color: "from-rose-100 to-orange-100", iconColor: "text-rose-600", delay: 0.1 },
            { icon: Shield, title: "Build Trust", desc: "Increase donor retention and confidence with transparent spending reports and verified impact documentation.", color: "from-orange-100 to-amber-100", iconColor: "text-orange-600", delay: 0.2 },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-pink-100/50 border border-pink-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + feature.delay }}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(251, 207, 232, 0.4)",
                transition: { duration: 0.2 }
              }}
            >
              <motion.div
                className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4`}
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </motion.div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center font-semibold shadow-lg shadow-pink-200">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Donors Make Contributions
                  </h4>
                  <p className="text-slate-600">
                    Support your favorite organizations and receive instant
                    confirmation with detailed receipts.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center font-semibold shadow-lg shadow-pink-200">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Organizations Log Expenses
                  </h4>
                  <p className="text-slate-600">
                    NPOs upload receipts and categorize spending with detailed
                    descriptions and impact data.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center font-semibold shadow-lg shadow-pink-200">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    FIFO Allocation Algorithm
                  </h4>
                  <p className="text-slate-600">
                    Our smart matching system allocates donations to expenses in
                    the order they were received and spent.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center font-semibold shadow-lg shadow-pink-200">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Track Your Impact
                  </h4>
                  <p className="text-slate-600">
                    View personalized dashboards showing exactly where your
                    money went and the real-world impact it created.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 rounded-3xl p-8 border border-pink-200 shadow-xl shadow-pink-200/50">
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                <div className="text-sm text-slate-500 mb-2">Your Impact</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
                  $1,250
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full"></div>
                    <span className="text-slate-700 font-medium">School Supplies: $500</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full"></div>
                    <span className="text-slate-700 font-medium">Food Program: $450</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full"></div>
                    <span className="text-slate-700 font-medium">Medical Aid: $300</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center text-slate-700 font-medium">
                Example donor dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-pink-100 mt-24 py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600">
          <p>&copy; 2026 Tracer. Building trust through transparency.</p>
        </div>
      </footer>
    </div>
  );
}
