import mongoose, { Schema, Document, Types } from "mongoose";
import ENV_VARIABLES from "../constants";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const id = Types.ObjectId;

export interface IBlog extends Document {
  adminStatus: "approved" | "rejected" | "flagged" | "pending";
  title: string;
  content: string; //markdown
  slug: string;
  tags: string[];
  banner: string;
  images?: string[];
  links?: string[];
  blogger: Types.ObjectId;
  views: number;
  isPublished: boolean;
  comments: Types.ObjectId[];
  reports: Types.ObjectId[];
  savedBy: Types.ObjectId[];
  orphaning: {
    orphanedAt: Date;
    isOrphaned: boolean;
  };
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
    blogger: { type: id, required: true, ref: "User" },
    isPublished: { type: Boolean, default: false },
    // limiting the number of comments allowed on a single blog
    views: { type: Number, default: 0, min: 0 },
    // comments: [{ type: id, ref: "Comment" }],
    // reports: [{ type: id, ref: "Report" }],
    // savedBy: [{ type: id, ref: "User" }],
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

// BlogSchema.plugin(mongooseAggregatePaginate);
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
