import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcrypt";
import ENV_VARIABLES from "../constants";

const id = Types.ObjectId;

export interface IUser extends Document {
  username: string;
  email: string;
  fullname: string;
  password: string;
  role: "user" | "blogger" | "admin";

  bio: string;
  avatar?: string;
  userSettings: {
    emailNotifications: boolean;
    darkMode: boolean;
    language: string;
    publiclyVisibleInfo: {
      email: boolean;
      fullname: boolean;
      savedBlogs: boolean;
      subscribedTo: boolean;
    };
  };

  savedBlogs: Types.ObjectId[];
  subscribedTo: Types.ObjectId[];
  commentsByMe: Types.ObjectId[];

  isEmailVerified: boolean;
  emailVerificationToken?: string;
  refreshToken: string;
}

const userSchema = new Schema<IUser>(
  {
    // essentials
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: [true, "Password is required field."] },
    role: {
      type: String,
      enum: ["user", "blogger", "admin"],
      default: "user",
    },
    fullname: { type: String, required: true, trim: true },

    // common properties
    avatar: { type: String },
    bio: { type: String, default: "Hey, I am on Bloggy" },
    userSettings: {
      emailNotifications: { type: Boolean, default: false },
      darkMode: { type: Boolean, default: false },
      language: { type: String, default: "en" },
      publiclyVisibleInfo: {
        email: { type: Boolean, default: false },
        fullname: { type: Boolean, default: false },
        savedBlogs: { type: Boolean, default: false },
        subscribedTo: { type: Boolean, default: false },
      },
    },

    subscribedTo: [{ type: id, ref: "User" }],
    // commentsByMe: [{ type: id, ref: "Comment" }], virtual field
    // savedBlogs: [{ type: id, ref: "Blog" }], virtual field

    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("savedBlogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "savedBy",
});

userSchema.virtual("commentsByMe", {
  ref: "Comment",
  localField: "_id",
  foreignField: "author",
});

// middleware hooks
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, ENV_VARIABLES.saltRounds);
    next();
  } catch (error: any) {
    next(error);
  }
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
