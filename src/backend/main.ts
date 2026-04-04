import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

// Enable CORS so your React app can make requests to this server
app.use(cors());

// Your simple Hello World endpoint with typed Request and Response
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: "HelloWorld" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});