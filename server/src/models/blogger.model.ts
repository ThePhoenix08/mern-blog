import mongoose, { Schema, Document, Model } from "mongoose";
import User, { IUser } from "./user.model";
const id = mongoose.Types.ObjectId;

interface IBlogger extends IUser {
  blogsByMe: (typeof id)[];
  totalSubscribers: number;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  coverImage?: string;
}

const bloggerSchema: Schema<IBlogger> = new Schema({
  coverImage: { type: String },
  totalSubscribers: { type: Number, default: 0 },
  socialLinks: {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  blogsByMe: [{ type: id, ref: "Blog" }],
});

const Blogger: Model<IBlogger> = User.discriminator<IBlogger>(
  "Blogger",
  bloggerSchema
);
export default Blogger;
