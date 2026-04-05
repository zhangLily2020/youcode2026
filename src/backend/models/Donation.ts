import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true, index: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    amount: { type: Number, required: true },
    // remaining is useful for FIFO allocation bookkeeping
    remaining: { type: Number, required: true },
    createdAt: { type: Number, default: () => Date.now(), index: true },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
