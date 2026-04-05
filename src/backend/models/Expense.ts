import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const expenseSchema = new mongoose.Schema(
  {
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    description: { type: String, default: "" },
    amount: { type: Number, required: true },
    allocations: { type: [allocationSchema], default: [] },
    unallocated: { type: Number, default: 0 },
    createdAt: { type: Number, default: () => Date.now(), index: true },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
