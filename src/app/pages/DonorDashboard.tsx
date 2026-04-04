import { useNavigate } from "react-router";
import { BarChart3, LogOut, DollarSign, TrendingUp, Heart, Package, Utensils, Stethoscope, BookOpen, Home } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";

// Mock data demonstrating FIFO allocation
const donorData = {
  name: "John Doe",
  email: "john@example.com",
  totalDonated: 1250,
  organizations: ["Hope Foundation", "Education First"],
  donations: [
    {
      id: 1,
      date: "2026-01-15",
      amount: 800,
      organization: "Hope Foundation",
      allocations: [
        {
          category: "School Supplies",
          amount: 500,
          icon: BookOpen,
          color: "bg-gradient-to-br from-pink-400 to-rose-400",
          description: "Textbooks and stationery for 50 students",
          date: "2026-01-20",
        },
        {
          category: "Food Program",
          amount: 300,
          icon: Utensils,
          color: "bg-gradient-to-br from-rose-400 to-orange-400",
          description: "Daily meals for 30 children",
          date: "2026-01-25",
        },
      ],
    },
    {
      id: 2,
      date: "2026-02-10",
      amount: 450,
      organization: "Education First",
      allocations: [
        {
          category: "Food Program",
          amount: 150,
          icon: Utensils,
          color: "bg-gradient-to-br from-orange-400 to-amber-400",
          description: "Continued meal support",
          date: "2026-02-12",
        },
        {
          category: "Medical Supplies",
          amount: 300,
          icon: Stethoscope,
          color: "bg-gradient-to-br from-pink-500 to-rose-500",
          description: "First aid kits and medications",
          date: "2026-02-15",
        },
      ],
    },
  ],
};

export function DonorDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

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
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{donorData.name}</p>
              <p className="text-xs text-slate-600">{donorData.email}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Your Impact Dashboard
          </h1>
          <p className="text-slate-600">
            Track where your donations go and see the real-world impact
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-3xl border-pink-100 shadow-xl shadow-pink-100/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total Donated</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">${donorData.totalDonated.toLocaleString()}</div>
              <p className="text-xs text-slate-600 mt-1">Across {donorData.donations.length} donations</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-rose-100 shadow-xl shadow-rose-100/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Organizations Supported</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <Heart className="h-5 w-5 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">{donorData.organizations.length}</div>
              <p className="text-xs text-slate-600 mt-1">{donorData.organizations.join(", ")}</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-orange-100 shadow-xl shadow-orange-100/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Impact Categories</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">4</div>
              <p className="text-xs text-slate-600 mt-1">Different areas of impact</p>
            </CardContent>
          </Card>
        </div>

        {/* Donation Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Your Donations</h2>

          {donorData.donations.map((donation) => (
            <Card key={donation.id} className="overflow-hidden rounded-3xl border-pink-100 shadow-xl shadow-pink-100/50">
              <CardHeader className="bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 border-b border-pink-100">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-slate-900">{donation.organization}</CardTitle>
                    <CardDescription className="mt-1 text-slate-600">
                      Donated on {new Date(donation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      ${donation.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600">Total donated</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      Allocation Progress
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      ${donation.allocations.reduce((sum, a) => sum + a.amount, 0)} / ${donation.amount}
                    </span>
                  </div>
                  <Progress
                    value={(donation.allocations.reduce((sum, a) => sum + a.amount, 0) / donation.amount) * 100}
                    className="h-2.5 bg-pink-100"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Where Your Money Went (FIFO):</h4>
                  {donation.allocations.map((allocation, idx) => {
                    const Icon = allocation.icon;
                    return (
                      <div
                        key={idx}
                        className="flex gap-4 p-4 bg-gradient-to-br from-pink-50/50 to-rose-50/50 rounded-2xl border border-pink-100"
                      >
                        <div className={`flex-shrink-0 w-14 h-14 ${allocation.color} rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200/50`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h5 className="font-semibold text-slate-900">{allocation.category}</h5>
                            <span className="font-bold text-pink-600">${allocation.amount}</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{allocation.description}</p>
                          <p className="text-xs text-slate-500">
                            Spent on {new Date(allocation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Impact Summary */}
        <Card className="mt-8 bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 border-pink-200 rounded-3xl shadow-xl shadow-pink-200/50">
          <CardHeader>
            <CardTitle className="text-slate-900">Your Total Impact</CardTitle>
            <CardDescription className="text-slate-700">Summary of all your contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center shadow-md shadow-pink-200">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">$500</div>
                  <div className="text-sm text-slate-600">School Supplies</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-md shadow-rose-200">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">$450</div>
                  <div className="text-sm text-slate-600">Food Programs</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-md shadow-pink-200">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">$300</div>
                  <div className="text-sm text-slate-600">Medical Supplies</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl flex items-center justify-center shadow-md shadow-orange-200">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">100%</div>
                  <div className="text-sm text-slate-600">Funds Allocated</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
