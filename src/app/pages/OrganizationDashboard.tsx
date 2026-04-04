import { useState } from "react";
import { useNavigate } from "react-router";
import { LogOut, DollarSign, Upload, TrendingUp, Users, Plus, X, Heart, Sparkles, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { motion } from "motion/react";

// Mock organization data
const organizationData = {
  name: "Hope Foundation",
  totalReceived: 15750,
  totalSpent: 12500,
  totalDonors: 43,
  donors: [
    { id: 1, name: "John Doe", email: "john@example.com", totalDonated: 1250, lastDonation: "2026-02-10", thanked: false },
    { id: 2, name: "Jane Smith", email: "jane@example.com", totalDonated: 2000, lastDonation: "2026-03-15", thanked: true },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", totalDonated: 750, lastDonation: "2026-03-20", thanked: false },
    { id: 4, name: "Alice Williams", email: "alice@example.com", totalDonated: 1500, lastDonation: "2026-04-01", thanked: false },
  ],
  expenditures: [
    {
      id: 1,
      category: "School Supplies",
      amount: 500,
      description: "Textbooks and stationery for 50 students",
      date: "2026-01-20",
      receipt: "receipt-001.pdf",
      status: "allocated",
    },
    {
      id: 2,
      category: "Food Program",
      amount: 450,
      description: "Daily meals for 30 children - January batch",
      date: "2026-01-25",
      receipt: "receipt-002.pdf",
      status: "allocated",
    },
    {
      id: 3,
      category: "Medical Supplies",
      amount: 300,
      description: "First aid kits and medications",
      date: "2026-02-15",
      receipt: "receipt-003.pdf",
      status: "allocated",
    },
    {
      id: 4,
      category: "Building Maintenance",
      amount: 800,
      description: "Roof repair and painting",
      date: "2026-03-01",
      receipt: "receipt-004.pdf",
      status: "allocated",
    },
  ],
};

export function OrganizationDashboard() {
  const navigate = useNavigate();
  const [expenditures, setExpenditures] = useState(organizationData.expenditures);
  const [donors, setDonors] = useState(organizationData.donors);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExpenditure, setNewExpenditure] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
  });

  const handleLogout = () => {
    navigate("/");
  };

  const handleToggleThanked = (donorId: number) => {
    setDonors(donors.map(donor =>
      donor.id === donorId ? { ...donor, thanked: !donor.thanked } : donor
    ));
  };

  const handleAddExpenditure = () => {
    if (newExpenditure.category && newExpenditure.amount && newExpenditure.description && newExpenditure.date) {
      const expenditure = {
        id: expenditures.length + 1,
        category: newExpenditure.category,
        amount: parseFloat(newExpenditure.amount),
        description: newExpenditure.description,
        date: newExpenditure.date,
        receipt: `receipt-${String(expenditures.length + 1).padStart(3, '0')}.pdf`,
        status: "pending" as const,
      };
      setExpenditures([...expenditures, expenditure]);
      setNewExpenditure({ category: "", amount: "", description: "", date: "" });
      setIsDialogOpen(false);
    }
  };

  const totalSpent = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
  const availableFunds = organizationData.totalReceived - totalSpent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ y: -100, x: Math.random() * window.innerWidth }}
            animate={{
              y: [null, window.innerHeight + 100],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
          >
            {i % 2 === 0 ? (
              <Heart className="w-12 h-12 text-pink-300" fill="currentColor" />
            ) : (
              <Sparkles className="w-10 h-10 text-rose-300" />
            )}
          </motion.div>
        ))}
      </div>
      {/* Navigation */}
      <nav className="border-b border-pink-100 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Tracer</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{organizationData.name}</p>
              <p className="text-xs text-slate-600">Organization Account</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Financial Dashboard
            </h1>
            <p className="text-slate-600">
              Track donations and manage expenditures transparently
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 rounded-xl shadow-lg shadow-pink-200">
                <Plus className="w-4 h-4" />
                Add Expenditure
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl border-pink-100">
              <DialogHeader>
                <DialogTitle className="text-slate-900">Upload New Expenditure</DialogTitle>
                <DialogDescription className="text-slate-600">
                  Add a new expense with receipt details.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-700">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., School Supplies, Food Program"
                    value={newExpenditure.category}
                    onChange={(e) => setNewExpenditure({ ...newExpenditure, category: e.target.value })}
                    className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-slate-700">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newExpenditure.amount}
                    onChange={(e) => setNewExpenditure({ ...newExpenditure, amount: e.target.value })}
                    className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the impact and usage of these funds"
                    value={newExpenditure.description}
                    onChange={(e) => setNewExpenditure({ ...newExpenditure, description: e.target.value })}
                    className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-slate-700">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpenditure.date}
                    onChange={(e) => setNewExpenditure({ ...newExpenditure, date: e.target.value })}
                    className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receipt" className="text-slate-700">Receipt Upload</Label>
                  <div className="border-2 border-dashed border-pink-200 rounded-2xl p-6 text-center hover:border-pink-300 transition-colors cursor-pointer bg-pink-50/50">
                    <Upload className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Click to upload receipt</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG (Max 10MB)</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50">
                  Cancel
                </Button>
                <Button onClick={handleAddExpenditure} className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 rounded-xl">
                  Add Expenditure
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-3xl border-pink-100 shadow-xl shadow-pink-100/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total Received</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                ${organizationData.totalReceived.toLocaleString()}
              </div>
              <p className="text-xs text-slate-600 mt-1">From {organizationData.totalDonors} donors</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-rose-100 shadow-xl shadow-rose-100/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total Spent</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                ${totalSpent.toLocaleString()}
              </div>
              <p className="text-xs text-slate-600 mt-1">{expenditures.length} expenditures</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-orange-100 shadow-xl shadow-orange-100/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Available Funds</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                ${availableFunds.toLocaleString()}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {((availableFunds / organizationData.totalReceived) * 100).toFixed(1)}% remaining
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-amber-100 shadow-xl shadow-amber-100/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Active Donors</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {organizationData.totalDonors}
              </div>
              <p className="text-xs text-slate-600 mt-1">Tracking their impact</p>
            </CardContent>
          </Card>
        </div>

        {/* Expenditure List */}
        <Card className="rounded-3xl border-pink-100 shadow-xl shadow-pink-100/50 bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-slate-900">Expenditure History</CardTitle>
            <CardDescription className="text-slate-600">
              All expenses with receipt documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenditures.map((expenditure) => (
                <div
                  key={expenditure.id}
                  className="flex items-start gap-4 p-4 bg-gradient-to-br from-pink-50/50 to-rose-50/50 rounded-2xl border border-pink-100"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{expenditure.category}</h4>
                        <p className="text-sm text-slate-600 mt-1">{expenditure.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xl font-bold text-pink-600">
                          ${expenditure.amount.toLocaleString()}
                        </div>
                        <span
                          className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                            expenditure.status === "allocated"
                              ? "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700"
                              : "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700"
                          }`}
                        >
                          {expenditure.status === "allocated" ? "Allocated to Donors" : "Pending Allocation"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>
                        Date: {new Date(expenditure.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span>Receipt: {expenditure.receipt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Donor Management */}
        <Card className="rounded-3xl border-pink-100 shadow-xl shadow-pink-100/50 bg-white">
          <CardHeader>
            <CardTitle className="text-slate-900">Donor Management</CardTitle>
            <CardDescription className="text-slate-600">
              Track donor contributions and thank you status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donors.map((donor) => (
                <motion.div
                  key={donor.id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-pink-50/50 to-rose-50/50 rounded-2xl border border-pink-100"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{donor.name}</h4>
                        <p className="text-sm text-slate-600">{donor.email}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-pink-600">
                          ${donor.totalDonated.toLocaleString()}
                        </div>
                        <p className="text-xs text-slate-500">
                          Last: {new Date(donor.lastDonation).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleToggleThanked(donor.id)}
                    variant={donor.thanked ? "default" : "outline"}
                    size="sm"
                    className={`gap-2 rounded-xl ${
                      donor.thanked
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0"
                        : "border-pink-300 text-pink-600 hover:bg-pink-50"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {donor.thanked ? "Thanked" : "Mark Thanked"}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
