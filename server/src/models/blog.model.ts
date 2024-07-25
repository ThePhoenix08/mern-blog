import mongoose, { Schema, Document } from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const id = mongoose.Types.ObjectId;

interface IBlog extends Document {
  title: string;
  content: string; //markdown
  slug: string;
  tags: [string];
  banner: string;
  images?: string[];
  links?: string[];
  blogger: typeof id;
  totalSaves: number;
  totalComments: number;
  totalLikes: number;
  views: number;
  isPublished: boolean;
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
    totalSaves: { type: Number, default: 0, min: 0 },
    totalLikes: { type: Number, default: 0, min: 0 },
    totalComments: { type: Number, default: 0, min: 0, max: 100 },
    // limiting the number of comments allowed on a single blog
    views: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// BlogSchema.plugin(mongooseAggregatePaginate);

const Blog = mongoose.model<IBlog>("Blog", BlogSchema);
export default Blog;
