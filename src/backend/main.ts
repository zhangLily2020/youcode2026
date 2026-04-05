import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './database';
import Donor from './models/Donor';
import Organization from './models/Organization';
import Donation from './models/Donation';
import Expense from './models/Expense';
import mongoose from 'mongoose';
// multer is used for handling multipart/form-data uploads (install with `npm install multer`)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists and serve it
const UPLOADS_DIR = path.join(process.cwd(), 'backend', 'uploads');
try { fs.mkdirSync(UPLOADS_DIR, { recursive: true }); } catch (e) {}
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer setup for receipt uploads
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req: any, file: any, cb: any) {
    const safe = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    cb(null, safe);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Async FIFO allocation helper using MongoDB transactions.
// Allocates expense.amount from oldest donations (by createdAt) for the given orgId.
async function allocateExpenseMongo(orgId: string, expenseId: string, amount: number) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let remaining = amount;
    const allocations: Array<{ donationId: mongoose.Types.ObjectId; amount: number }> = [];

    const donations = await Donation.find({ orgId, remaining: { $gt: 0 } })
      .sort({ createdAt: 1 })
      .session(session);

    for (const d of donations) {
      if (remaining <= 0) break;
      const take = Math.min(d.remaining, remaining);
      if (take <= 0) continue;
      d.remaining = Number(d.remaining) - take;
      remaining -= take;
      allocations.push({ donationId: d._id, amount: take });
      await d.save({ session });
    }

    const expense = await Expense.findById(expenseId).session(session);
    if (expense) {
      // assign allocations and unallocated; keep types flexible with `any` to avoid strict DocumentArray typing issues
      (expense as any).allocations = allocations.map(a => ({ donationId: a.donationId, amount: a.amount }));
      expense.unallocated = remaining;
      // update status field so frontend can display allocation state
      (expense as any).status = remaining > 0 ? 'pending' : 'allocated';
      await expense.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return { allocations: allocations.map(a => ({ donationId: a.donationId.toString(), amount: a.amount })), unallocated: remaining };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

// --- API endpoints ---

app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ ok: true, time: Date.now() });
});

// List donors (dev)
app.get('/api/donors', async (req: Request, res: Response) => {
  try {
    const docs = await Donor.find().lean();
    const out = docs.map(d => ({ id: (d as any)._id ? (d as any)._id.toString() : (d as any).id, name: (d as any).name, email: (d as any).email }));
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: 'failed to read donors', details: String(err) });
  }
});

// List donors from MongoDB (dev) - returns full donor docs (including password) so use carefully
app.get('/api/mongo/donors', async (req: Request, res: Response) => {
  try {
    const docs = await Donor.find().lean();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'failed to read mongo donors', details: String(err) });
  }
});

// List organizations (dev)
app.get('/api/organizations', async (req: Request, res: Response) => {
  try {
    const docs = await Organization.find().lean();
  const out = docs.map(o => ({ id: (o as any)._id ? (o as any)._id.toString() : (o as any).id, name: (o as any).name, email: (o as any).email }));
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: 'failed to read organizations', details: String(err) });
  }
});

// List organizations from MongoDB (dev) - returns full org docs (including password) so use carefully
app.get('/api/mongo/organizations', async (req: Request, res: Response) => {
  try {
    const docs = await Organization.find().lean();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'failed to read mongo organizations', details: String(err) });
  }
});

// Login (email + password + role)
app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ error: 'email,password,role required' });

  try {
    if (role === 'donor') {
      const donor = await Donor.findOne({ email }).lean();
      if (!donor) return res.status(401).json({ error: 'invalid credentials' });
      if ((donor as any).password !== password) return res.status(401).json({ error: 'invalid credentials' });
      const safe = { id: (donor as any)._id.toString(), name: donor.name, email: donor.email } as any;
      return res.json({ role: 'donor', donor: safe });
    }

    if (role === 'org' || role === 'organization') {
      const org = await Organization.findOne({ email }).lean();
      if (!org) return res.status(401).json({ error: 'invalid credentials' });
      if ((org as any).password !== password) return res.status(401).json({ error: 'invalid credentials' });
      const safe = { id: (org as any)._id.toString(), name: org.name, email: org.email } as any;
      return res.json({ role: 'org', organization: safe });
    }

    return res.status(400).json({ error: 'unknown role' });
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({ error: 'internal error' });
  }
});

// Register (donor or org) - now stored in MongoDB
app.post('/api/register', async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name || !role) return res.status(400).json({ error: 'email,password,name,role required' });
  try {
    if (role === 'donor') {
      const exists = await Donor.findOne({ email }).lean();
      if (exists) return res.status(409).json({ error: 'donor exists' });
      const newDonor = new Donor({ name, email, password });
      const saved = await newDonor.save();
      const out = { id: saved._id.toString(), name: saved.name, email: saved.email };
      return res.status(201).json(out);
    }
    if (role === 'org' || role === 'organization') {
      const exists = await Organization.findOne({ email }).lean();
      if (exists) return res.status(409).json({ error: 'org exists' });
      const newOrg = new Organization({ name, email, password });
      const saved = await newOrg.save();
      const out = { id: saved._id.toString(), name: saved.name, email: saved.email };
      return res.status(201).json(out);
    }
    return res.status(400).json({ error: 'unknown role' });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// Create donation (Mongo)
app.post('/api/donations', async (req: Request, res: Response) => {
  const { donorId, orgId, amount } = req.body;
  if (!donorId || !orgId || !amount) return res.status(400).json({ error: 'donorId, orgId, amount required' });
  try {
    const donation = new Donation({ donorId, orgId, amount: Number(amount), remaining: Number(amount), createdAt: Date.now() });
    const saved = await donation.save();
    const out = { id: saved._id.toString(), donorId: saved.donorId, orgId: saved.orgId, amount: saved.amount, remaining: saved.remaining, createdAt: saved.createdAt };
    res.status(201).json(out);
  } catch (err) {
    console.error('Create donation error', err);
    res.status(500).json({ error: 'failed to create donation', details: String(err) });
  }
});

// Create expense and run FIFO allocation (Mongo). Accepts multipart/form-data with optional `receipt` file.
app.post('/api/expenses', upload.single('receipt'), async (req: Request, res: Response) => {
  // multer populates req.file and req.body
  const body: any = req.body || {};
  const file: any = (req as any).file;
  const { orgId, category, description, amount, date, location } = body;
  if (!orgId || !amount) return res.status(400).json({ error: 'orgId and amount required' });
  try {
    const receiptPath = file ? `/uploads/${file.filename}` : (body.receipt || null);
    const expenseDoc = new Expense({ orgId, category: category || null, description: description || '', amount: Number(amount), allocations: [], unallocated: Number(amount), date: date || new Date().toISOString(), location: location || '', receipt: receiptPath, status: 'pending', createdAt: Date.now() });
    const saved = await expenseDoc.save();
    const allocationResult = await allocateExpenseMongo(orgId, saved._id.toString(), Number(amount));
    const updated = await Expense.findById(saved._id).lean();
    const out = {
      expense: updated,
      allocation: allocationResult,
    };
    res.status(201).json(out);
  } catch (err) {
    console.error('Create expense error', err);
    res.status(500).json({ error: 'failed to create expense', details: String(err) });
  }
});

function donationCreatedAtMs(d: any): number {
  const c = d?.createdAt;
  if (c == null) return Date.now();
  if (typeof c === 'number' && !Number.isNaN(c)) return c;
  const t = new Date(c).getTime();
  return Number.isNaN(t) ? Date.now() : t;
}

// Get donor dashboard (Mongo)
app.get('/api/dashboard/donor/:id', async (req: Request, res: Response) => {
  const donorId = req.params.id;
  try {
    const donations = await Donation.find({ donorId }).lean();
    const donationIds = donations.map(d => (d as any)._id);

    const uniqueOrgIds = Array.from(new Set(donations.map((d: any) => d.orgId.toString())));
    const orgDocs = await Organization.find({ _id: { $in: uniqueOrgIds } }).lean();
    const orgIdToName: Record<string, string> = {};
    for (const o of orgDocs) {
      orgIdToName[(o as any)._id.toString()] = (o as any).name;
    }

    const expenses = await Expense.find({ 'allocations.donationId': { $in: donationIds } }).lean();

    const impactByCategory: Record<string, number> = {};
    for (const exp of expenses) {
      if (!exp.allocations) continue;
      for (const a of exp.allocations) {
        const allocDonationId = (a as any).donationId;
        if (!allocDonationId || !donationIds.some(di => di.toString() === allocDonationId.toString())) continue;
        const label = ((exp as any).category && String((exp as any).category).trim()) ? String((exp as any).category).trim() : 'General';
        impactByCategory[label] = (impactByCategory[label] || 0) + Number((a as any).amount || 0);
      }
    }

    const impactSummary = Object.entries(impactByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((x, y) => y.amount - x.amount);

    const donationsOut = donations.map(d => {
      const allocations: any[] = [];
      for (const exp of expenses) {
        if (!exp.allocations) continue;
        for (const a of exp.allocations) {
          if ((a as any).donationId && donationIds.find(di => di.toString() === (a as any).donationId.toString()) && (a as any).donationId.toString() === (d as any)._id.toString()) {
            allocations.push({ expenseId: (exp as any)._id.toString(), orgId: (exp as any).orgId, amount: (a as any).amount, expenseDescription: (exp as any).description, expenseCreatedAt: (exp as any).createdAt, expenseCategory: (exp as any).category || null, receipt: (exp as any).receipt || null, location: (exp as any).location || "" });
          }
        }
      }
      const oid = (d as any).orgId.toString();
      const createdMs = donationCreatedAtMs(d);
      return {
        id: (d as any)._id.toString(),
        donorId: (d as any).donorId,
        orgId: (d as any).orgId,
        organization: orgIdToName[oid] || 'Unknown organization',
        amount: d.amount,
        remaining: d.remaining,
        createdAt: createdMs,
        date: new Date(createdMs).toISOString(),
        allocations,
      };
    });

    const donorDoc = await Donor.findById(donorId).lean();
    const donor = donorDoc ? { id: (donorDoc as any)._id.toString(), name: (donorDoc as any).name, email: (donorDoc as any).email } : { id: donorId, name: 'Unknown', email: '' };

    const totalDonated = donationsOut.reduce((s: number, x: any) => s + Number(x.amount || 0), 0);
    const totalAllocated = donations.reduce((s: number, d: any) => s + (Number(d.amount || 0) - Number(d.remaining ?? d.amount)), 0);
    const fundsAllocatedPercent = totalDonated > 0 ? Math.min(100, Math.round((totalAllocated / totalDonated) * 100)) : 0;
    const supportedOrgNames = Array.from(new Set(donations.map((d: any) => orgIdToName[d.orgId.toString()] || 'Unknown organization')));
    const impactCategoryCount = Object.keys(impactByCategory).filter(k => impactByCategory[k] > 0).length;

    res.json({
      donor: {
        id: donor.id,
        name: donor.name,
        email: donor.email,
        totalDonated,
        donationCount: donations.length,
        organizations: supportedOrgNames,
        organizationIds: uniqueOrgIds,
        supportedOrganizationCount: supportedOrgNames.length,
        impactCategoryCount,
        impactSummary,
        fundsAllocatedPercent,
        donations: donationsOut,
      },
    });
  } catch (err) {
    console.error('Donor dashboard error', err);
    res.status(500).json({ error: 'failed to load donor dashboard', details: String(err) });
  }
});

// Get organization dashboard (Mongo)
app.get('/api/dashboard/org/:id', async (req: Request, res: Response) => {
  const orgId = req.params.id;
  try {
    const orgDoc = await Organization.findById(orgId).lean();
    if (!orgDoc) return res.status(404).json({ error: 'org not found' });

    const donations = await Donation.find({ orgId }).lean();
    const totalReceived = donations.reduce((s: number, d: any) => s + Number(d.amount || 0), 0);

    const expenditures = await Expense.find({ orgId }).sort({ createdAt: -1 }).lean();
    // Money drawn from the donor pool (FIFO), not the full expense amount when partially unallocated
    const totalSpent = expenditures.reduce((s: number, e: any) => {
      const amt = Number(e.amount || 0);
      const unalloc = Number(e.unallocated ?? 0);
      return s + Math.max(0, amt - unalloc);
    }, 0);

    // Pool still available to cover future expenses (matches sum of donation.remaining)
    const availableFunds = donations.reduce((s: number, d: any) => s + Number(d.remaining ?? 0), 0);

    const donorIdSet = new Set(donations.map((d: any) => d.donorId.toString()));
    const totalDonors = donorIdSet.size;

    const byDonor: Record<string, { total: number; lastMs: number }> = {};
    for (const d of donations) {
      const id = (d as any).donorId.toString();
      const amt = Number((d as any).amount || 0);
      const ms = donationCreatedAtMs(d);
      if (!byDonor[id]) byDonor[id] = { total: 0, lastMs: 0 };
      byDonor[id].total += amt;
      if (ms > byDonor[id].lastMs) byDonor[id].lastMs = ms;
    }
    const donorIds = Object.keys(byDonor);
    const donorDocs = donorIds.length ? await Donor.find({ _id: { $in: donorIds } }).lean() : [];
    const donors = donorIds.map((id) => {
      const doc = donorDocs.find((x: any) => x._id.toString() === id);
      const agg = byDonor[id];
      return {
        id,
        name: doc ? (doc as any).name : 'Unknown',
        email: doc ? (doc as any).email : '',
        totalDonated: agg.total,
        lastDonation: new Date(agg.lastMs).toISOString().slice(0, 10),
        thanked: false,
      };
    }).sort((a, b) => b.totalDonated - a.totalDonated);

    const expendituresOut = expenditures.map((e: any) => ({
      id: e._id.toString(),
      _id: e._id.toString(),
      orgId: e.orgId,
      category: e.category || 'General',
      description: e.description || '',
      amount: Number(e.amount || 0),
      unallocated: Number(e.unallocated ?? 0),
      date: e.date,
      location: e.location || '',
      receipt: e.receipt || null,
      status: e.status || 'pending',
      createdAt: e.createdAt,
    }));

    res.json({
      organization: {
        id: (orgDoc as any)._id.toString(),
        name: (orgDoc as any).name,
        email: (orgDoc as any).email,
        totalReceived,
        totalSpent,
        availableFunds,
        totalDonors,
      },
      totalReceived,
      totalSpent,
      availableFunds,
      totalDonors,
      donors,
      expenditures: expendituresOut,
    });
  } catch (err) {
    console.error('Org dashboard error', err);
    res.status(500).json({ error: 'failed to load org dashboard', details: String(err) });
  }
});

app.post('/api/organizations', async (req: Request, res: Response): Promise<any> => {
  try {
    const newOrg = new Organization(req.body); // Expects { name, email, password }
    const savedOrg = await newOrg.save();
    res.status(201).json(savedOrg);
  } catch (error) {
    res.status(500).json({ error: "Failed to create organization", details: error });
  }
});

const PORT = 3000;
app.listen(PORT, async () => {
  await connectDB();

  // Ensure there are demo accounts in MongoDB for quick testing
  try {
    const donorCount = await Donor.countDocuments();
    if (donorCount === 0) {
      await Donor.create({ name: 'Alice Tester', email: 'alice@example.com', password: 'alicepass' });
      console.log('Created demo donor: alice@example.com / alicepass');
    } else {
      console.log(`Donors in DB: ${donorCount}`);
    }

    const orgCount = await Organization.countDocuments();
    if (orgCount === 0) {
      await Organization.create({ name: 'Hope Foundation', email: 'org@example.com', password: 'orgpass' });
      console.log('Created demo org: org@example.com / orgpass');
    } else {
      console.log(`Orgs in DB: ${orgCount}`);
    }
  } catch (err) {
    console.error('Error ensuring demo accounts', err);
  }

  console.log(`Backend server is running on http://localhost:${PORT}`);
});