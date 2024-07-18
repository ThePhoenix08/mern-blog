import mongoose, { Schema, Document } from "mongoose";
const id = mongoose.Types.ObjectId;

interface IComment extends Document {
  content: string;
  author: typeof id;
  blog: typeof id;
}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: id, required: true, ref: "User" },
    blog: { type: id, required: true, ref: "Blog" },
  },
  { timestamps: true }
);

// future enhancement: pagination for comments
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// CommentSchema.plugin(mongooseAggregatePaginate);

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;