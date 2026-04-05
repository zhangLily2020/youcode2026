import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LogOut, DollarSign, Upload, TrendingUp, Users, Plus, Heart, Sparkles, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { motion } from "motion/react";
import { EXPENSE_CATEGORY_OPTIONS, OTHER_VALUE, resolveExpenseCategory, getCategoryDisplay } from "../constants/expenseCategories";

const API_ORIGIN = "http://localhost:3000";

export function OrganizationDashboard() {
  const navigate = useNavigate();
  const [expenditures, setExpenditures] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [organization, setOrganization] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExpenditure, setNewExpenditure] = useState<{
    categoryKey: string;
    otherCategory: string;
    amount: string;
    description: string;
    date: string;
    receiptFile: File | null;
  }>({
    categoryKey: EXPENSE_CATEGORY_OPTIONS[0]?.value ?? "",
    otherCategory: "",
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    receiptFile: null,
  });

  useEffect(() => {
    const raw = localStorage.getItem('tracer_user');
    if (!raw) {
      navigate('/');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const org = parsed.organization || parsed.org || parsed;
      if (!org || !org.id) {
        navigate('/');
        return;
      }
      setOrganization(org);
      (async () => {
        try {
          const resp = await fetch(`${API_ORIGIN}/api/dashboard/org/${org.id}`);
          if (resp.ok) {
            const json = await resp.json();
            setOrganization({ ...org, ...(json.organization || {}) });
            setExpenditures(json.expenditures || []);
            setDonors(json.donors || []);
          }
        } catch (err) {
          console.error('Failed to fetch org dashboard', err);
        }
      })();
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    try { localStorage.removeItem('tracer_user'); } catch {}
    window.location.assign('/');
  };

  const handleToggleThanked = (donorId: string | number) => {
    setDonors(donors.map(donor =>
      String(donor.id) === String(donorId) ? { ...donor, thanked: !donor.thanked } : donor
    ));
  };

  const handleAddExpenditure = async () => {
    if (!organization) return;
    const category = resolveExpenseCategory(newExpenditure.categoryKey, newExpenditure.otherCategory);
    if (newExpenditure.amount && newExpenditure.description && newExpenditure.date) {
      try {
        const form = new FormData();
        form.append('orgId', organization.id);
        form.append('category', category);
        form.append('description', newExpenditure.description);
        form.append('amount', String(Number(newExpenditure.amount)));
        form.append('date', newExpenditure.date);
        if (newExpenditure.receiptFile) form.append('receipt', newExpenditure.receiptFile);

        const resp = await fetch(`${API_ORIGIN}/api/expenses`, {
          method: 'POST',
          body: form,
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          alert(err.error || 'Failed to add expenditure');
          return;
        }
        const dash = await fetch(`${API_ORIGIN}/api/dashboard/org/${organization.id}`);
        if (dash.ok) {
          const j = await dash.json();
          setOrganization((prev: any) => ({ ...prev, ...(j.organization || {}) }));
          setExpenditures(j.expenditures || []);
          setDonors(j.donors || []);
        }
        setNewExpenditure({
          categoryKey: EXPENSE_CATEGORY_OPTIONS[0]?.value ?? "",
          otherCategory: "",
          amount: "",
          description: "",
          date: new Date().toISOString().slice(0, 10),
          receiptFile: null,
        });
        setIsDialogOpen(false);
      } catch (err) {
        console.error('Add expenditure failed', err);
        alert('Add expenditure failed');
      }
    }
  };

  const totalReceived = Number(organization?.totalReceived ?? 0);
  const totalSpent = Number(organization?.totalSpent ?? 0);
  const availableFunds = Number(organization?.availableFunds ?? 0);
  const totalDonors = Number(organization?.totalDonors ?? 0);
  const pctRemaining =
    totalReceived > 0 ? Math.min(100, Math.max(0, (availableFunds / totalReceived) * 100)).toFixed(1) : "0.0";

  function receiptHref(receipt: string | null | undefined) {
    if (!receipt) return null;
    if (receipt.startsWith("http")) return receipt;
    return `${API_ORIGIN}${receipt.startsWith("/") ? "" : "/"}${receipt}`;
  }

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
              <p className="text-sm font-medium text-slate-900">{organization?.name ?? "Organization"}</p>
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
                  <Label htmlFor="category" className="text-slate-700">Impact category</Label>
                  <Select
                    value={newExpenditure.categoryKey}
                    onValueChange={(value) => setNewExpenditure({ ...newExpenditure, categoryKey: value })}
                  >
                    <SelectTrigger id="category" className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400 h-auto min-h-12 py-2">
                      <span className="flex items-center gap-3 text-left">
                        {(() => {
                          const opt = EXPENSE_CATEGORY_OPTIONS.find((o) => o.value === newExpenditure.categoryKey);
                          if (!opt) return <span className="text-slate-500">Choose category</span>;
                          return (
                            <>
                              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${opt.gradient} shadow-sm`}>
                                <opt.Icon className="h-4 w-4 text-white" />
                              </span>
                              <span>{opt.label}</span>
                            </>
                          );
                        })()}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="py-2">
                          <span className="flex items-center gap-3">
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${opt.gradient} shadow-sm`}>
                              <opt.Icon className="h-4 w-4 text-white" />
                            </span>
                            <span>{opt.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newExpenditure.categoryKey === OTHER_VALUE && (
                    <Input
                      placeholder="Describe this category (optional)"
                      value={newExpenditure.otherCategory}
                      onChange={(e) => setNewExpenditure({ ...newExpenditure, otherCategory: e.target.value })}
                      className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-400 mt-2"
                    />
                  )}
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
                  <div
                    onClick={() => document.getElementById('receiptInput')?.click()}
                    className="border-2 border-dashed border-pink-200 rounded-2xl p-6 text-center hover:border-pink-300 transition-colors cursor-pointer bg-pink-50/50"
                  >
                    <Upload className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Click to upload receipt</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG (Max 10MB)</p>
                    <p className="text-xs text-slate-500 mt-2">{newExpenditure.receiptFile ? newExpenditure.receiptFile.name : ''}</p>
                    <input id="receiptInput" type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => {
                      const f = e.target.files && e.target.files[0];
                      setNewExpenditure({ ...newExpenditure, receiptFile: f || null });
                    }} />
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
                ${totalReceived.toLocaleString()}
              </div>
              <p className="text-xs text-slate-600 mt-1">From {totalDonors} donor{totalDonors === 1 ? "" : "s"}</p>
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
              <p className="text-xs text-slate-600 mt-1">{expenditures.length} expenditure{expenditures.length === 1 ? "" : "s"}</p>
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
              <p className="text-xs text-slate-600 mt-1">{pctRemaining}% remaining in pool</p>
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
                {totalDonors}
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
              {expenditures.map((expenditure) => {
                const cat = getCategoryDisplay(expenditure.category);
                const CatIcon = cat.Icon;
                return (
                <div
                  key={String(expenditure._id || expenditure.id)}
                  className="flex items-start gap-4 p-4 bg-gradient-to-br from-pink-50/50 to-rose-50/50 rounded-2xl border border-pink-100"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient} shadow-md shadow-pink-200/40`}>
                    <CatIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{cat.label}</h4>
                        <p className="text-sm text-slate-600 mt-1">{expenditure.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xl font-bold text-pink-600">
                          ${Number(expenditure.amount || 0).toLocaleString()}
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
                      <span>
                        Receipt: {expenditure.receipt ? (
                          expenditure.receipt.endsWith('.pdf') ? (
                            <a href={(expenditure.receipt.startsWith('http') ? expenditure.receipt : `http://localhost:3000${expenditure.receipt}`)} target="_blank" rel="noreferrer" className="text-pink-600 underline">View PDF</a>
                          ) : (
                            <a href={(expenditure.receipt.startsWith('http') ? expenditure.receipt : `http://localhost:3000${expenditure.receipt}`)} target="_blank" rel="noreferrer">
                              <img src={(expenditure.receipt.startsWith('http') ? expenditure.receipt : `http://localhost:3000${expenditure.receipt}`)} alt="receipt" className="inline-block h-10 rounded-md" />
                            </a>
                          )
                        ) : (
                          'No receipt'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                );
              })}
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
                  key={String(donor.id)}
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
