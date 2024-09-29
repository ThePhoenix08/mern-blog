import { PrivilegeLevels } from "@/types/data";

const authRoutes: { path: string; elementName: string }[] = [
  { path: "/", elementName: "Landing" },
  { path: "login", elementName: "Login" },
  { path: "signup", elementName: "SignUp" },
  { path: "*", elementName: "NotFound" },
];

const appRoutes: { path: string; elementName: string; index?: boolean }[] = [
  { path: "profile", elementName: "Profile", index: true },
  { path: "profile/:userId", elementName: "PublicProfile" },
  { path: "settings", elementName: "Settings" },
  { path: "subscribtions", elementName: "Subscribtions" },
  { path: "messages", elementName: "Messages" },
];

const blogRoutes: {
  path: string;
  elementName: string;
  privilege: PrivilegeLevels;
  index?: boolean;
}[] = [
  { path: "read", elementName: "Read", privilege: 2, index: true },
  { path: "edit", elementName: "Edit", privilege: 1 },
];

const blogsRoutes: {
  path: string;
  elementName: string;
  privilege: PrivilegeLevels;
  index?: boolean;
}[] = [
  { path: "explore", elementName: "Explore", privilege: 2, index: true },
  { path: "saved", elementName: "Saved", privilege: 2 },
  { path: "feed", elementName: "Subscribed", privilege: 2 },
  { path: "popular", elementName: "Popular", privilege: 2 },
  { path: "my-blogs", elementName: "MyBlogs", privilege: 1 },
  { path: "moderate-blogs", elementName: "ModerateBlogs", privilege: 0 },
];

const dashboardRoutes: {
  path: string;
  elementName: string;
  privilege: PrivilegeLevels;
  index?: boolean;
}[] = [
  { path: "user/:userId", elementName: "UserDashboard", privilege: 2 },
  {
    path: "blogger/:bloggerId",
    elementName: "BloggerDashboard",
    privilege: 1,
  },
  { path: "admin/:adminId", elementName: "AdminDashboard", privilege: 0 },
];

const ForgotPasswordRoutes: {
  path: string;
  elementName: string;
  index?: boolean;
}[] = [
  { path: "", elementName: "EmailForm", index: true },
  { path: "new", elementName: "ForgotPasswordForm" },
  { path: "resetCode", elementName: "ResetCodeForm" },
  { path: "success", elementName: "ForgotPasswordSuccess" },
];

export {
  authRoutes,
  appRoutes,
  blogRoutes,
  blogsRoutes,
  dashboardRoutes,
  ForgotPasswordRoutes,
};
