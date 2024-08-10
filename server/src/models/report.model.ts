import ENV_VARIABLES from "../constants";
import mongoose, { Schema, Document, Types } from "mongoose";
const id = Types.ObjectId;

export interface IReport extends Document {
  reason: string;
  status: "pending" | "resolved" | "dismissed";

  reportedBy: Types.ObjectId;
  relatedDocs:
    | {
        targetType: "blog";
        blog?: Types.ObjectId;
      }
    | {
        targetType: "comment";
        comment?: Types.ObjectId;
      }
    | {
        targetType: "user";
        user?: Types.ObjectId;
      };

  orphaning: {
    orphanedAt: Date;
    isOrphaned: boolean;
  };
}

const ReportSchema = new Schema(
  {
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending",
    },

    reportedBy: { type: id, ref: "User", required: true },
    relatedDocs: {
      targetType: {
        type: String,
        enum: ["blog", "comment", "user"],
        required: true,
      },
      blog: { type: id, ref: "Blog" },
      comment: { type: id, ref: "Comment" },
      user: { type: id, ref: "User" },
    },

    orphaning: {
      orphanedAt: { type: Date, default: Date.now },
      isOrphaned: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

ReportSchema.index(
  { orphaning: 1 },
  { expireAfterSeconds: ENV_VARIABLES.expireAfterOrphandedOthers }
);

const Report = mongoose.model<IReport>("Report", ReportSchema);
export default Report;
