import { useNavigate } from "react-router";
import { ArrowRight, BarChart3, Eye, Shield } from "lucide-react";
import { Button } from "../components/ui/button";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      {/* Navigation */}
      <nav className="border-b border-pink-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Tracer</span>
          </div>
          <Button
            onClick={() => navigate("/login")}
            className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 rounded-xl shadow-lg shadow-pink-200"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Track Every Dollar,
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
              See Real Impact
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            A transparent platform connecting donors with non-profit organizations.
            Watch your donations transform into real-world change with detailed
            impact tracking and complete financial transparency.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 rounded-xl shadow-lg shadow-pink-200"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              size="lg"
              className="rounded-xl border-2 border-pink-200 text-pink-700 hover:bg-pink-50"
            >
              For Organizations
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-pink-100/50 border border-pink-100">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mb-4">
              <Eye className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Complete Transparency
            </h3>
            <p className="text-slate-600">
              See exactly where every dollar goes with detailed breakdowns and
              real-time tracking of organizational spending.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-rose-100/50 border border-rose-100">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
              <BarChart3 className="w-7 h-7 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Impact Metrics
            </h3>
            <p className="text-slate-600">
              Track measurable outcomes and see the direct impact of your
              contributions through comprehensive analytics.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-orange-100/50 border border-orange-100">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Build Trust
            </h3>
            <p className="text-slate-600">
              Increase donor retention and confidence with transparent spending
              reports and verified impact documentation.
            </p>
          </div>
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
