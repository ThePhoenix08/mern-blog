import mongoose, { Schema, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ENV_VARIABLES from "../constants";

const id = mongoose.Types.ObjectId;

export interface IUser extends Document {
  username: string;
  email: string;
  fullname: string;
  password: string;
  role: "user" | "blogger" | "admin";
  savedBlogs: (typeof id)[];
  subscribedTo: (typeof id)[];
  commentsByMe: (typeof id)[];
  refreshToken: string;
  bio: string;
  avatar?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
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

  isPasswordCorrect(argPassword: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}

const userSchema: Schema<IUser> = new Schema(
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

    savedBlogs: [{ type: id, ref: "Blog" }],
    subscribedTo: [{ type: id, ref: "User" }],
    commentsByMe: [{ type: id, ref: "Comment" }],
    refreshToken: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
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
  },
  { timestamps: true }
);

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

userSchema.methods.isPasswordCorrect = async function (
  this: IUser,
  argPassword: string
): Promise<boolean> {
  const isCorrect = await bcrypt.compare(argPassword, this.password);
  return isCorrect;
};

userSchema.methods.generateAccessToken = async function (
  this: IUser
): Promise<string> {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    ENV_VARIABLES.accessTokenSecret as jwt.Secret,
    { expiresIn: ENV_VARIABLES.accessTokenExpiry }
  );
};
userSchema.methods.generateRefreshToken = async function (
  this: IUser
): Promise<string> {
  return jwt.sign(
    {
      _id: this._id,
    },
    ENV_VARIABLES.refreshTokenSecret as jwt.Secret,
    { expiresIn: ENV_VARIABLES.refreshTokenExpiry }
  );
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
