import { useNavigate } from "react-router";
import { LogOut, DollarSign, TrendingUp, Heart, Package, Utensils, Stethoscope, BookOpen, Home, Sparkles, MapPin, Plus, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

// Mock data demonstrating allocation
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
          receipt: "receipt-001.pdf",
          locations: [
            { name: "Riverside Elementary School", address: "123 Oak Street, Springfield", amount: 250 },
            { name: "Maple Grove Primary", address: "456 Elm Avenue, Riverside", amount: 150 },
            { name: "Sunset Valley School", address: "789 Pine Road, Greenfield", amount: 100 },
          ],
        },
        {
          category: "Food Program",
          amount: 300,
          icon: Utensils,
          color: "bg-gradient-to-br from-rose-400 to-orange-400",
          description: "Daily meals for 30 children",
          date: "2026-01-25",
          receipt: "receipt-002.pdf",
          locations: [
            { name: "Riverside Elementary School", address: "123 Oak Street, Springfield", amount: 180 },
            { name: "Community Kitchen Center", address: "321 Main Street, Springfield", amount: 120 },
          ],
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
          receipt: "receipt-003.pdf",
          locations: [
            { name: "Hope Community Center", address: "555 Bridge Street, Lakeside", amount: 90 },
            { name: "Youth Outreach Kitchen", address: "777 Harbor Way, Bayside", amount: 60 },
          ],
        },
        {
          category: "Medical Supplies",
          amount: 300,
          icon: Stethoscope,
          color: "bg-gradient-to-br from-pink-500 to-rose-500",
          description: "First aid kits and medications",
          date: "2026-02-15",
          receipt: "receipt-004.pdf",
          locations: [
            { name: "St. Mary's Community Hospital", address: "888 Health Plaza, Riverside", amount: 180 },
            { name: "Central Medical Clinic", address: "999 Wellness Drive, Springfield", amount: 120 },
          ],
        },
      ],
    },
  ],
};

const availableOrganizations = [
  "Hope Foundation",
  "Education First",
  "Community Outreach",
  "Youth Development Center",
];

export function DonorDashboard() {
  const navigate = useNavigate();
  const [countUp, setCountUp] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDonation, setNewDonation] = useState({
    amount: "",
    organization: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountUp((prev) => {
        if (prev < donorData.totalDonated) {
          return Math.min(prev + 50, donorData.totalDonated);
        }
        return prev;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const handleAddDonation = () => {
    if (newDonation.amount && newDonation.organization) {
      // In a real app, this would make an API call
      alert(`Donation of $${newDonation.amount} to ${newDonation.organization} submitted successfully!`);
      setNewDonation({ amount: "", organization: "" });
      setIsDialogOpen(false);
    }
  };

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
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </motion.div>
            <span className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Tracer</span>
          </motion.div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Your Impact Dashboard
            </h1>
            <p className="text-slate-600">
              Track where your donations go and see the real-world impact
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 rounded-xl shadow-lg shadow-pink-200">
                <Plus className="w-4 h-4" />
                Make a Donation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl border-pink-100">
              <DialogHeader>
                <DialogTitle className="text-slate-900">Make a Donation</DialogTitle>
                <DialogDescription className="text-slate-600">
                  Choose an organization and enter your donation amount.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-slate-700">Organization</Label>
                  <Select
                    value={newDonation.organization}
                    onValueChange={(value) => setNewDonation({ ...newDonation, organization: value })}
                  >
                    <SelectTrigger className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400">
                      <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOrganizations.map((org) => (
                        <SelectItem key={org} value={org}>
                          {org}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-slate-700">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newDonation.amount}
                    onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                    className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50">
                  Cancel
                </Button>
                <Button onClick={handleAddDonation} className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 rounded-xl">
                  Donate
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: DollarSign,
              title: "Total Donated",
              value: `$${countUp.toLocaleString()}`,
              subtitle: `Across ${donorData.donations.length} donations`,
              color: "from-pink-100 to-rose-100",
              iconColor: "text-pink-600",
              delay: 0,
            },
            {
              icon: Heart,
              title: "Organizations Supported",
              value: donorData.organizations.length,
              subtitle: donorData.organizations.join(", "),
              color: "from-rose-100 to-orange-100",
              iconColor: "text-rose-600",
              delay: 0.1,
            },
            {
              icon: TrendingUp,
              title: "Impact Categories",
              value: 4,
              subtitle: "Different areas of impact",
              color: "from-orange-100 to-amber-100",
              iconColor: "text-orange-600",
              delay: 0.2,
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(251, 207, 232, 0.3)",
              }}
            >
              <Card className="rounded-3xl border-pink-100 shadow-xl shadow-pink-100/50 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">{stat.title}</CardTitle>
                  <motion.div
                    className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: stat.delay + 0.2, type: "spring" }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-xs text-slate-600 mt-1">{stat.subtitle}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Impact Summary */}
        <Card className="mb-8 bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 border-pink-200 rounded-3xl shadow-xl shadow-pink-200/50">
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

        {/* Donation Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Your Donations</h2>

          {donorData.donations.map((donation, donationIdx) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + donationIdx * 0.1 }}
            >
              <Card className="overflow-hidden rounded-3xl border-pink-100 shadow-xl shadow-pink-100/50">
                <CardHeader className="bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 border-b border-pink-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-slate-900">{donation.organization}</CardTitle>
                      <CardDescription className="mt-1 text-slate-600">
                        Donated on {new Date(donation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </CardDescription>
                    </div>
                    <motion.div
                      className="text-right"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + donationIdx * 0.1, type: "spring" }}
                    >
                      <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        ${donation.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600">Total donated</div>
                    </motion.div>
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
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 1 + donationIdx * 0.1 }}
                      style={{ transformOrigin: "left" }}
                    >
                      <Progress
                        value={(donation.allocations.reduce((sum, a) => sum + a.amount, 0) / donation.amount) * 100}
                        className="h-2.5 bg-pink-100"
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Where Your Money Went:</h4>
                    {donation.allocations.map((allocation, idx) => {
                      const Icon = allocation.icon;
                      return (
                        <motion.div
                          key={idx}
                          className="flex gap-4 p-4 bg-gradient-to-br from-pink-50/50 to-rose-50/50 rounded-2xl border border-pink-100"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 1.2 + donationIdx * 0.1 + idx * 0.1 }}
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 10px 30px rgba(251, 207, 232, 0.3)",
                          }}
                        >
                          <motion.div
                            className={`flex-shrink-0 w-14 h-14 ${allocation.color} rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200/50`}
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Icon className="w-7 h-7 text-white" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h5 className="font-semibold text-slate-900">{allocation.category}</h5>
                              <motion.span
                                className="font-bold text-pink-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 1.3 + donationIdx * 0.1 + idx * 0.1, type: "spring" }}
                              >
                                ${allocation.amount}
                              </motion.span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{allocation.description}</p>
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <p className="text-xs text-slate-500">
                                Spent on {new Date(allocation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full gap-1.5"
                                  onClick={() => alert(`Viewing receipt: ${allocation.receipt}`)}
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  View Receipt
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full gap-1.5"
                                    >
                                      <MapPin className="w-3.5 h-3.5" />
                                      View Locations
                                    </Button>
                                  </DialogTrigger>
                                <DialogContent className="max-w-2xl bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                                  <DialogHeader>
                                    <DialogTitle className="text-slate-900 flex items-center gap-2">
                                      <div className={`w-10 h-10 ${allocation.color} rounded-xl flex items-center justify-center`}>
                                        <Icon className="w-5 h-5 text-white" />
                                      </div>
                                      {allocation.category} Recipients
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-600">
                                      Your ${allocation.amount} donation supported these locations
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-3 mt-4">
                                    {allocation.locations.map((location, locIdx) => (
                                      <motion.div
                                        key={locIdx}
                                        className="flex gap-4 p-4 bg-white rounded-2xl border border-pink-100 shadow-sm"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: locIdx * 0.1 }}
                                      >
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-200 to-rose-200 rounded-xl flex items-center justify-center">
                                          <MapPin className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between gap-2 mb-1">
                                            <h6 className="font-semibold text-slate-900">{location.name}</h6>
                                            <span className="font-bold text-pink-600 text-sm">${location.amount}</span>
                                          </div>
                                          <p className="text-sm text-slate-600">{location.address}</p>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
