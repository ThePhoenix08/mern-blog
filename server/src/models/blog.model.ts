import mongoose, { Schema, Document, Types } from "mongoose";
import ENV_VARIABLES from "../constants";

const id = Types.ObjectId;

export interface IBlog extends Document {
  title: string;
  content: string; //markdown
  slug: string;
  tags: string[];
  banner: string;
  images?: string[];
  links?: string[];
  views: number;
  isPublished: boolean;

  blogger: Types.ObjectId;
  comments: Types.ObjectId[];
  reports: Types.ObjectId[];
  savedBy: Types.ObjectId[];

  orphaning: {
    orphanedAt: Date;
    isOrphaned: boolean;
  };
  adminStatus: "approved" | "rejected" | "flagged" | "pending";
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, trim: true, index: true },
    banner: { type: String, required: true },
    images: [String],
    tags: [String],
    links: [String],
    views: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },

    blogger: { type: id, required: true, ref: "User" },
    // comments: [{ type: id, ref: "Comment" }], virtual
    // reports: [{ type: id, ref: "Report" }], virtual
    // savedBy: [{ type: id, ref: "User" }], virtual

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

BlogSchema.index(
  { orphaning: 1 },
  { expireAfterSeconds: ENV_VARIABLES.expireAfterOrphandedBlogs }
);

BlogSchema.virtual("comments", {
  ref: "Comment",
  localField: "comments",
  foreignField: "blog",
});

BlogSchema.virtual("reports", {
  ref: "Report",
  localField: "reports",
  foreignField: "blog",
});

BlogSchema.virtual("savedBy", {
  ref: "User",
  localField: "savedBy",
  foreignField: "savedBlogs",
});

const Blog = mongoose.model<IBlog>("Blog", BlogSchema);
export default Blog;
