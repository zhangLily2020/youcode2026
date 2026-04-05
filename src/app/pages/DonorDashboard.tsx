import { useNavigate } from "react-router";
import { LogOut, DollarSign, TrendingUp, Heart, Sparkles, Plus, FileText, MapPin } from "lucide-react";
import { getCategoryDisplay } from "../constants/expenseCategories";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { motion } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";

function parseTimestampMs(v: unknown): number {
  if (v == null) return NaN;
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  const t = new Date(String(v)).getTime();
  return Number.isNaN(t) ? NaN : t;
}

function formatDonationDate(donation: { date?: string; createdAt?: number }) {
  const ms = parseTimestampMs(donation.date ?? donation.createdAt);
  if (Number.isNaN(ms)) return "—";
  return new Date(ms).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

type OrgDonationGroup = {
  orgId: string;
  organization: string;
  totalAmount: number;
  totalAllocated: number;
  allocations: any[];
  lastMs: number;
  donationCount: number;
};

function aggregateDonationsByOrg(donations: any[]): OrgDonationGroup[] {
  const map = new Map<string, Omit<OrgDonationGroup, "totalAllocated">>();
  for (const d of donations) {
    const oid = String(d.orgId ?? "");
    if (!oid) continue;
    if (!map.has(oid)) {
      map.set(oid, {
        orgId: oid,
        organization: d.organization || "Organization",
        totalAmount: 0,
        allocations: [],
        lastMs: 0,
        donationCount: 0,
      });
    }
    const g = map.get(oid)!;
    g.totalAmount += Number(d.amount || 0);
    g.donationCount += 1;
    const ms = parseTimestampMs(d.date ?? d.createdAt);
    if (!Number.isNaN(ms)) g.lastMs = Math.max(g.lastMs, ms);
    for (const a of d.allocations || []) g.allocations.push(a);
  }
  return Array.from(map.values())
    .map((g) => ({
      ...g,
      totalAllocated: g.allocations.reduce((s, a) => s + Number(a.amount || 0), 0),
    }))
    .sort((a, b) => b.lastMs - a.lastMs);
}

function formatAggregatedOrgSubtitle(g: OrgDonationGroup) {
  if (g.donationCount <= 1) {
    return `Donated on ${formatDonationDate({ createdAt: g.lastMs })}`;
  }
  return `${g.donationCount} gifts to this organization · Last on ${formatDonationDate({ createdAt: g.lastMs })}`;
}

export function DonorDashboard() {
  const navigate = useNavigate();
  const [countUp, setCountUp] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDonation, setNewDonation] = useState({ amount: "", orgId: "" });
  const [donor, setDonor] = useState<any | null>(null);
  const [donorDataState, setDonorDataState] = useState<any | null>(null);
  const [organizations, setOrganizations] = useState<Array<any>>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ isOpen: boolean; location: string; category: string }>({ isOpen: false, location: "", category: "" });

  useEffect(() => {
    const raw = localStorage.getItem('glassbox_user');
    if (!raw) {
      navigate('/');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      // parsed may be { role: 'donor', donor: {...} } from backend
      const d = parsed.donor || parsed.organization || parsed;
      setDonor(d);
      // fetch donor dashboard
      (async () => {
        try {
          const resp = await fetch(`http://localhost:3000/api/dashboard/donor/${d.id}`);
          if (resp.ok) {
            const json = await resp.json();
            setDonorDataState(json.donor);
            setCountUp(json.donor.totalDonated || 0);
          }
        } catch (err) {
          console.error('Failed to fetch donor dashboard', err);
        }
      })();
      // fetch organizations for donation select
      (async () => {
        try {
          const resp2 = await fetch('http://localhost:3000/api/organizations');
          if (resp2.ok) {
            const orgs = await resp2.json();
            setOrganizations(orgs);
            if (orgs.length) setNewDonation((s) => ({ ...s, orgId: orgs[0].id }));
          }
        } catch (err) {
          console.error('Failed to fetch organizations', err);
        }
      })();
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountUp((prev) => {
        if (!donorDataState) return prev;
        if (prev < donorDataState.totalDonated) {
          return Math.min(prev + 50, donorDataState.totalDonated);
        }
        return prev;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [donorDataState]);

  const handleLogout = () => {
    try { localStorage.removeItem('glassbox_user'); } catch {}
    window.location.assign('/');
  };

  const donationsByOrg = useMemo(
    () => aggregateDonationsByOrg(donorDataState?.donations || []),
    [donorDataState?.donations],
  );

  const handleAddDonation = async () => {
    if (!newDonation.amount || !newDonation.orgId || !donor) return;
    try {
      const resp = await fetch('http://localhost:3000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorId: donor.id, orgId: newDonation.orgId, amount: Number(newDonation.amount) }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        alert(err.error || 'Failed to create donation');
        return;
      }
      // refresh donor dashboard
      const dash = await fetch(`http://localhost:3000/api/dashboard/donor/${donor.id}`);
      if (dash.ok) {
        const json = await dash.json();
        setDonorDataState(json.donor);
      }
      setNewDonation({ amount: "", orgId: organizations[0]?.id ?? "" });
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Donation failed', err);
      alert('Donation failed');
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
      <nav className="sticky top-0 z-30 border-b border-pink-100 bg-white/80 backdrop-blur-md">
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
            <span className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Glassbox</span>
          </motion.div>
          <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{donorDataState?.name || 'Donor'}</p>
                        <p className="text-xs text-slate-600">{donorDataState?.email || ''}</p>
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
                    value={newDonation.orgId}
                    onValueChange={(value) => setNewDonation({ ...newDonation, orgId: value })}
                  >
                    <SelectTrigger className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400">
                      <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
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
              subtitle: `Across ${donorDataState?.donationCount ?? donorDataState?.donations?.length ?? 0} donation${(donorDataState?.donationCount ?? donorDataState?.donations?.length ?? 0) === 1 ? "" : "s"}`,
              color: "from-pink-100 to-rose-100",
              iconColor: "text-pink-600",
              delay: 0,
            },
            {
              icon: Heart,
              title: "Organizations Supported",
              value: donorDataState?.supportedOrganizationCount ?? (donorDataState?.organizations?.length ?? 0),
              subtitle: (donorDataState?.organizations && donorDataState.organizations.length > 0)
                ? donorDataState.organizations.join(", ")
                : "None yet — make a donation",
              color: "from-rose-100 to-orange-100",
              iconColor: "text-rose-600",
              delay: 0.1,
            },
            {
              icon: TrendingUp,
              title: "Impact Categories",
              value: donorDataState?.impactCategoryCount ?? 0,
              subtitle: (donorDataState?.impactSummary && donorDataState.impactSummary.length > 0)
                ? donorDataState.impactSummary.map((x: { category: string }) => x.category).join(", ")
                : "Categories appear when orgs report spending",
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
              {(donorDataState?.impactSummary || []).slice(0, 3).map((row: { category: string; amount: number }, i: number) => {
                const disp = getCategoryDisplay(row.category);
                const Icon = disp.Icon;
                return (
                  <div key={`${row.category}-${i}`} className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-lg">
                    <div className={`w-12 h-12 bg-gradient-to-br ${disp.gradient} rounded-2xl flex items-center justify-center shadow-md shadow-pink-200`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">${Number(row.amount).toLocaleString()}</div>
                      <div className="text-sm text-slate-600">{disp.label}</div>
                    </div>
                  </div>
                );
              })}
              {(!donorDataState?.impactSummary || donorDataState.impactSummary.length === 0) && (
                <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-lg md:col-span-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">$0</div>
                    <div className="text-sm text-slate-600">No spending categories yet — impact appears when organizations log expenses.</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl flex items-center justify-center shadow-md shadow-orange-200">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{donorDataState?.fundsAllocatedPercent ?? 0}%</div>
                  <div className="text-sm text-slate-600">Funds Allocated</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donation Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Your Donations</h2>

          {donationsByOrg.map((g, donationIdx) => (
            <motion.div
              key={g.orgId}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + donationIdx * 0.1 }}
            >
              <Card className="overflow-hidden rounded-3xl border-pink-100 shadow-xl shadow-pink-100/50">
                <CardHeader className="bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 border-b border-pink-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-slate-900">{g.organization}</CardTitle>
                      <CardDescription className="mt-1 text-slate-600">
                        {formatAggregatedOrgSubtitle(g)}
                      </CardDescription>
                    </div>
                    <motion.div
                      className="text-right"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + donationIdx * 0.1, type: "spring" }}
                    >
                      <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        ${Number(g.totalAmount).toLocaleString()}
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
                        ${g.totalAllocated.toLocaleString()} / ${Number(g.totalAmount).toLocaleString()}
                      </span>
                    </div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 1 + donationIdx * 0.1 }}
                      style={{ transformOrigin: "left" }}
                    >
                      <Progress
                        value={g.totalAmount > 0 ? (g.totalAllocated / g.totalAmount) * 100 : 0}
                        className="h-2.5 bg-pink-100"
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Where Your Money Went:</h4>
                      {(g.allocations || []).map((allocation: any, idx: number) => {
                      const label = allocation.expenseCategory || allocation.expenseDescription || "Expense";
                      const disp = getCategoryDisplay(label);
                      const Icon = disp.Icon;
                      const alloc = {
                        category: disp.label,
                        amount: allocation.amount,
                        icon: Icon,
                        color: `bg-gradient-to-br ${disp.gradient}`,
                        description: allocation.expenseDescription || "",
                        date: (() => {
                          const ms = parseTimestampMs(allocation.expenseCreatedAt);
                          return Number.isNaN(ms) ? new Date().toISOString() : new Date(ms).toISOString();
                        })(),
                        receipt: allocation.receipt || "",
                      };
                      return (
                        <motion.div
                          key={`${allocation.expenseId}-${idx}`}
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
                            className={`flex-shrink-0 w-14 h-14 ${alloc.color} rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200/50`}
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Icon className="w-7 h-7 text-white" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h5 className="font-semibold text-slate-900">{alloc.category}</h5>
                              <motion.span
                                className="font-bold text-pink-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 1.3 + donationIdx * 0.1 + idx * 0.1, type: "spring" }}
                              >
                                ${alloc.amount}
                              </motion.span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{alloc.description}</p>
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <p className="text-xs text-slate-500">
                                Spent on {new Date(alloc.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full gap-1.5"
                                  onClick={() => {
                                    const r = allocation.receipt;
                                    if (!r) {
                                      alert('No receipt available');
                                      return;
                                    }
                                    const url = r.startsWith('http') ? r : `http://localhost:3000${r}`;
                                    window.open(url, '_blank', 'noopener,noreferrer');
                                  }}
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  View Receipt
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-full gap-1.5"
                                  onClick={() => {
                                    const loc = allocation.location;
                                    setSelectedLocation({
                                      isOpen: true,
                                      location: loc || "No location specified",
                                      category: alloc.category,
                                    });
                                  }}
                                >
                                  <MapPin className="w-3.5 h-3.5" />
                                  View Location
                                </Button>
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

        {/* Location Modal */}
        <Dialog open={selectedLocation.isOpen} onOpenChange={(open) => setSelectedLocation({ ...selectedLocation, isOpen: open })}>
          <DialogContent className="sm:max-w-md rounded-3xl border-pink-100">
            <DialogHeader>
              <DialogTitle className="text-slate-900">Donation Location</DialogTitle>
              <DialogDescription className="text-slate-600">
                Where your donation for {selectedLocation.category} was spent
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-violet-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Location</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedLocation.location}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedLocation({ ...selectedLocation, isOpen: false })}
                className="flex-1 rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
