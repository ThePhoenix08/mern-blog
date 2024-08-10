import ENV_VARIABLES from "../constants";
import mongoose, { Schema, Document, Types } from "mongoose";
const id = Types.ObjectId;

export interface INotif extends Document {
  type: "comment" | "blog";
  content: string;
  isRead: boolean;

  user: Types.ObjectId;
  relatedItem: {
    comment?: Types.ObjectId;
    blog?: Types.ObjectId;
  };

  orphaning: {
    orphanedAt: Date;
    isOrphaned: boolean;
  };
}

const NotifSchema = new Schema(
  {
    type: { type: String, enum: ["comment", "blog"], required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },

    user: { type: id, ref: "User", required: true },
    relatedItem: {
      comment: { type: id, ref: "Comment" },
      blog: { type: id, ref: "Blog" },
    },

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
