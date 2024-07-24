import mongoose, { Schema, Document } from "mongoose";
const id = mongoose.Types.ObjectId;

interface IReport extends Document {
  reason: string;
  reportedBy: typeof id;
  target: typeof id;
  targetType: "blog" | "comment";
}

const ReportSchema = new Schema(
  {
    reason: { type: String, required: true },
    reportedBy: { type: id, ref: "User", required: true },
    target: { type: id, required: true },
    targetType: { type: String, enum: ["blog", "comment"], required: true },
    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model<IReport>("Report", ReportSchema);
export default Report;
