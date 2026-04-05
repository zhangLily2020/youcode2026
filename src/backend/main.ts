import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './database';
import Donor from './models/Donor';
import Organization from './models/Organization';
import Donation from './models/Donation';
import Expense from './models/Expense';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json());

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

// Create expense and run FIFO allocation (Mongo)
app.post('/api/expenses', async (req: Request, res: Response) => {
  const { orgId, category, description, amount, date, receipt } = req.body;
  if (!orgId || !amount) return res.status(400).json({ error: 'orgId and amount required' });
  try {
    const expenseDoc = new Expense({ orgId, description: description || '', amount: Number(amount), allocations: [], unallocated: Number(amount), date: date || new Date().toISOString(), receipt: receipt || null, status: 'pending', createdAt: Date.now() });
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

// Get donor dashboard (Mongo)
app.get('/api/dashboard/donor/:id', async (req: Request, res: Response) => {
  const donorId = req.params.id;
  try {
    const donations = await Donation.find({ donorId }).lean();
    const donationIds = donations.map(d => (d as any)._id);

    const expenses = await Expense.find({ 'allocations.donationId': { $in: donationIds } }).lean();

    const donationsOut = donations.map(d => {
      const allocations: any[] = [];
      for (const exp of expenses) {
        if (!exp.allocations) continue;
        for (const a of exp.allocations) {
          if ((a as any).donationId && donationIds.find(di => di.toString() === (a as any).donationId.toString()) && (a as any).donationId.toString() === (d as any)._id.toString()) {
            allocations.push({ expenseId: (exp as any)._id.toString(), orgId: (exp as any).orgId, amount: (a as any).amount, expenseDescription: (exp as any).description, expenseCreatedAt: (exp as any).createdAt });
          }
        }
      }
      return { id: (d as any)._id.toString(), donorId: (d as any).donorId, orgId: (d as any).orgId, amount: d.amount, remaining: d.remaining, createdAt: d.createdAt, allocations };
    });

    const donorDoc = await Donor.findById(donorId).lean();
    const donor = donorDoc ? { id: (donorDoc as any)._id.toString(), name: (donorDoc as any).name, email: (donorDoc as any).email } : { id: donorId, name: 'Unknown', email: '' };

    const totalDonated = donationsOut.reduce((s: number, x: any) => s + Number(x.amount || 0), 0);
    const organizations = Array.from(new Set(donationsOut.map((d: any) => d.orgId)));

    res.json({ donor: { id: donor.id, name: donor.name, email: donor.email, totalDonated, organizations, donations: donationsOut } });
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

    const expenditures = await Expense.find({ orgId }).lean();
    const totalSpent = expenditures.reduce((s: number, e: any) => s + (Number(e.amount || 0) - (e.unallocated || 0)), 0);
    const totalDonors = Array.from(new Set(donations.map((d: any) => d.donorId.toString()))).length;

    res.json({ organization: { id: (orgDoc as any)._id.toString(), name: (orgDoc as any).name, email: (orgDoc as any).email }, totalReceived, totalSpent, totalDonors, expenditures });
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