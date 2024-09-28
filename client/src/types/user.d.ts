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
