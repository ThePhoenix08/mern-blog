import mongoose, { Schema, Document, Model, Types } from "mongoose";
import User, { IUser } from "./user.model";
import { IBlog } from "./blog.model";
const id = Types.ObjectId;

export interface IBlogger extends IUser {
  blogsByMe: Types.ObjectId[];
  totalSubscribers: number;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  coverImage?: string;
}

const bloggerSchema: Schema<IBlogger> = new Schema(
  {
    coverImage: { type: String },
    // totalSubscribers: { type: Number, default: 0 },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bloggerSchema.virtual("blogsByMe", {
  ref: "Blog",
  localField: "_id",
  foreignField: "blogger",
});

bloggerSchema.virtual("totalSubscribers", {
  ref: "user",
  localField: "_id",
  foreignField: "subscribedTo",
  count: true,
});

const Blogger: Model<IBlogger> = User.discriminator<IBlogger>(
  "Blogger",
  bloggerSchema
);
export default Blogger;
