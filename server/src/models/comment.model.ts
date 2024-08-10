import ENV_VARIABLES from "../constants";
import mongoose, { Schema, Document, Types } from "mongoose";
const id = Types.ObjectId;

export interface IComment extends Document {
  content: string;

  author: Types.ObjectId;
  blog: Types.ObjectId;
  blogger: Types.ObjectId;
  likes: Types.ObjectId[];

  orphaning: {
    orphanedAt: Date;
    isOrphaned: boolean;
  };
  adminStatus: "approved" | "rejected" | "flagged" | "pending";
}

const commentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },

    author: { type: id, required: true, ref: "User" },
    blog: { type: id, required: true, ref: "Blog" },
    // blogger: { type: id, ref: "Blogger" }, virtual
    // likes: [{ type: id, ref: "User" }], virtual

    orphaning: {
      orphanedAt: { type: Date, default: Date.now },
      isOrphaned: { type: Boolean, default: false },
    },
    adminStatus: {
      type: String,
      enum: ["approved", "rejected", "flagged", "pending"],
      default: "pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

commentSchema.virtual("likes", {
  ref: "User",
  localField: "likedComments",
  foreignField: "likes",
});

commentSchema.virtual("blogger", {
  ref: "Blogger",
  localField: "blog",
  foreignField: "blogsByMe",
  justOne: true,
});

commentSchema.index(
  { orphaning: 1 },
  { expireAfterSeconds: ENV_VARIABLES.expireAfterOrphandedOthers }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
