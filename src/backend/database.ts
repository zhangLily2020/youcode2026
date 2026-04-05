import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

// start connection to DB
export async function connectDB() {
  try {
		const conn = await mongoose.connect(String(process.env.DB_URI));
		console.log(`MongoDB Connected`);
	} catch (error) {
		throw error;
	}
}