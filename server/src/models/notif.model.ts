import mongoose, { Schema, Document } from "mongoose";
const id = mongoose.Types.ObjectId;

interface INotif extends Document {
  user: typeof id;
  type: "comment" | "blog";
  relatedItem: typeof id;
  content: string;
  isRead: boolean;
}

const NotifSchema = new Schema(
  {
    user: { type: id, ref: "User", required: true },
    type: { type: String, enum: ["comment", "blog"], required: true },
    relatedItem: { type: id, ref: "Blog", required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notif = mongoose.model<INotif>("Notif", NotifSchema);
export default Notif;
