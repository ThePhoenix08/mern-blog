import { Schema, Model, Types } from "mongoose";
import User, { IUser } from "./user.model";

export interface IBlogger extends IUser {
  totalSubscribers: number;

  coverImage?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };

  blogsByMe: Types.ObjectId[];
}

const bloggerSchema: Schema<IBlogger> = new Schema(
  {
    // totalSubscribers: { type: Number, default: 0 }, virtual

    coverImage: { type: String },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },

    // blogsByMe: [{ type: id, ref: "Blog" }], virtual
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
