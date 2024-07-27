import ENV_VARIABLES from "../constants";
import mongoose, { Schema, Document, Types } from "mongoose";
const id = Types.ObjectId;

export interface INotif extends Document {
  user: Types.ObjectId;
  type: "comment" | "blog";
  relatedItem: {
    comment?: Types.ObjectId;
    blog?: Types.ObjectId;
  };
  content: string;
  isRead: boolean;
  orphaning: {
    orphanedAt: Date;
    isOrphaned: boolean;
  };
}

const NotifSchema = new Schema(
  {
    user: { type: id, ref: "User", required: true },
    type: { type: String, enum: ["comment", "blog"], required: true },
    relatedItem: {
      comment: { type: id, ref: "Comment" },
      blog: { type: id, ref: "Blog" },
    },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    orphaning: {
      orphanedAt: { type: Date, default: Date.now },
      isOrphaned: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

NotifSchema.index(
  { orphaning: 1 },
  { expireAfterSeconds: ENV_VARIABLES.expireAfterOrphandedOthers }
);

const Notif = mongoose.model<INotif>("Notif", NotifSchema);
export default Notif;
