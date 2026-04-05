import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './database';
import Donor from './models/Donor';
import Organization from './models/Organization';

const app = express();
app.use(express.json());

// Enable CORS so your React app can make requests to this server
app.use(cors());

app.post('/api/donors', async (req: Request, res: Response): Promise<any> => {
  try {
    const newDonor = new Donor(req.body); // Expects { name, email, password }
    const savedDonor = await newDonor.save();
    res.status(201).json(savedDonor);
  } catch (error) {
    res.status(500).json({ error: "Failed to create donor", details: error });
  }
});

// Your simple Hello World endpoint with typed Request and Response
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: "HelloWorld" });
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
  console.log(`Backend server is running on http://localhost:${PORT}`);
});