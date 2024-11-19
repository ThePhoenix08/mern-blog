export type User = {
  _id: string;
  username: string;
  email: string;
  role: "user" | "blogger" | "admin";
  fullname: string;
  bio: string;
  userSettings: {
    publiclyVisibleInfo: {
      email: boolean;
      fullname: boolean;
      savedBlogs: boolean;
      subscribedTo: boolean;
    };
    emailNotifications: boolean;
    darkMode: boolean;
    language: string;
  };
  avatar: string;
  cover?: string;
  subscribedTo: string[];
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Blogger = User & {
  totalSubscribers: number;

  coverImage?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };

  blogsByMe: Types.ObjectId[];
};
