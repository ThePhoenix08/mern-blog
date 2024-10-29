const BASE_URL = "http://localhost:4000/api/v1";

type Endpoint = {
  name: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  endpoint: string;
};

const baseUrls = {
  public: `${BASE_URL}/public`,
  account: `${BASE_URL}/auth/account`,
  users: `${BASE_URL}/auth/users`,
  blogger: `${BASE_URL}/auth/blogger`,
  content: `${BASE_URL}/auth/content`,
  reports: `${BASE_URL}/auth/reports`,
  admin: `${BASE_URL}/auth/admin`,
};

export type fnName =
  | "healthCheck"
  | "register"
  | "login"
  | "forgetPassword"
  | "refreshUser"
  | "resetPassword"
  | "logout"
  | "getProfile"
  | "updateProfile"
  | "deleteProfile"
  | "uploadAvatar"
  | "toggleSubscribeToBlogger"
  | "getUserComments"
  | "getUserPublicProfile"
  | "getUserSettings"
  | "updateUserSettings"
  | "getBlogs"
  | "deleteBlogs"
  | "createBlog"
  | "getBlog"
  | "updateBlog"
  | "deleteBlog"
  | "updateBloggerProfile"
  | "uploadCoverImage"
  | "getBloggerSpecificAnalytics"
  | "getManyBlogs"
  | "getBlogTags"
  | "toggleBlogSave"
  | "getComments"
  | "addComment"
  | "updateComment"
  | "deleteComment"
  | "createReport"
  | "getNotifs"
  | "markAsRead"
  | "deleteNotif"
  | "getAllUsers"
  | "updateUserRole"
  | "banUser"
  | "getAllBlogs"
  | "moderateBlog"
  | "adminDeleteBlog"
  | "getAllReports"
  | "resolveReport"
  | "deleteReport"
  | "moderateComment"
  | "adminDeleteComment"
  | "getAdminTotals"
  | "getAdminMetricsOverTime"
  | "getAdminGrowthRates"
  | "getAdminTopPerformers"
  | "getTopPerformersOptions"
  | "getSpecificAnalytics";

export const restEndpoints: Record<fnName, Endpoint> = {
  healthCheck: {
    name: "healthCheck",
    method: "get",
    endpoint: "/public/health",
  },
  register: {
    name: "register",
    method: "post",
    endpoint: "/public/register",
  },
  login: {
    name: "login",
    method: "post",
    endpoint: "/public/login",
  },
  forgetPassword: {
    name: "forgetPassword",
    method: "post",
    endpoint: "/public/forgetPassword",
  },
  refreshUser: {
    name: "refreshUser",
    method: "post",
    endpoint: "/account/refreshUser",
  },
  resetPassword: {
    name: "resetPassword",
    method: "post",
    endpoint: "/account/resetPassword",
  },
  logout: {
    name: "logout",
    method: "post",
    endpoint: "/account/logout",
  },
  getProfile: {
    name: "getProfile",
    method: "get",
    endpoint: "/users/profile",
  },
  updateProfile: {
    name: "updateProfile",
    method: "patch",
    endpoint: "/users/profile",
  },
  deleteProfile: {
    name: "deleteProfile",
    method: "delete",
    endpoint: "/users/profile",
  },
  uploadAvatar: {
    name: "uploadAvatar",
    method: "post",
    endpoint: "/users/avatar",
  },
  toggleSubscribeToBlogger: {
    name: "toggleSubscribeToBlogger",
    method: "put",
    endpoint: "/users/subscribe/:bloggerId",
  },
  getUserComments: {
    name: "getUserComments",
    method: "post",
    endpoint: "/users/myComments",
  },
  getUserPublicProfile: {
    name: "getUserPublicProfile",
    method: "get",
    endpoint: "/users/publicProfile/:userId",
  },
  getUserSettings: {
    name: "getUserSettings",
    method: "get",
    endpoint: "/users/settings",
  },
  updateUserSettings: {
    name: "updateUserSettings",
    method: "patch",
    endpoint: "/users/settings",
  },
  getBlogs: {
    name: "getBlogs",
    method: "get",
    endpoint: "/blogger/posts",
  },
  deleteBlogs: {
    name: "deleteBlogs",
    method: "delete",
    endpoint: "/blogger/posts",
  },
  createBlog: {
    name: "createBlog",
    method: "post",
    endpoint: "/blogger/posts",
  },
  getBlog: {
    name: "getBlog",
    method: "get",
    endpoint: "/blogger/blog/:id",
  },
  updateBlog: {
    name: "updateBlog",
    method: "patch",
    endpoint: "/blogger/blog/:id",
  },
  deleteBlog: {
    name: "deleteBlog",
    method: "delete",
    endpoint: "/blogger/blog/:id",
  },
  updateBloggerProfile: {
    name: "updateProfile",
    method: "patch",
    endpoint: "/blogger/updateProfile",
  },
  uploadCoverImage: {
    name: "uploadCoverImage",
    method: "post",
    endpoint: "/blogger/cover",
  },
  getBloggerSpecificAnalytics: {
    name: "getBloggerSpecificAnalytics",
    method: "get",
    endpoint: "/blogger/specificAnalytics",
  },
  getManyBlogs: {
    name: "getBlogs",
    method: "get",
    endpoint: "/content/posts",
  },
  getBlogTags: {
    name: "getBlogTags",
    method: "get",
    endpoint: "/content/tags",
  },
  toggleBlogSave: {
    name: "toggleBlogSave",
    method: "put",
    endpoint: "/content/blog/:id",
  },
  getComments: {
    name: "getComments",
    method: "get",
    endpoint: "/content/comments/:blogId",
  },
  addComment: {
    name: "addComment",
    method: "post",
    endpoint: "/content/comments/:blogId",
  },
  updateComment: {
    name: "updateComment",
    method: "patch",
    endpoint: "/content/comments/:blogId/:commentId",
  },
  deleteComment: {
    name: "deleteComment",
    method: "delete",
    endpoint: "/content/comments/:blogId/:commentId",
  },
  createReport: {
    name: "createReport",
    method: "post",
    endpoint: "/reports/new",
  },
  getNotifs: {
    name: "getNotifs",
    method: "get",
    endpoint: "/reports/notifs",
  },
  markAsRead: {
    name: "markAsRead",
    method: "put",
    endpoint: "/reports/notifs/:notifId",
  },
  deleteNotif: {
    name: "deleteNotif",
    method: "delete",
    endpoint: "/reports/notifs/:notifId",
  },
  getAllUsers: {
    name: "getAllUsers",
    method: "get",
    endpoint: "/admin/users",
  },
  updateUserRole: {
    name: "updateUserRole",
    method: "patch",
    endpoint: "/admin/user/:userId",
  },
  banUser: {
    name: "banUser",
    method: "delete",
    endpoint: "/admin/user/:userId",
  },
  getAllBlogs: {
    name: "getAllBlogs",
    method: "get",
    endpoint: "/admin/blogs",
  },
  moderateBlog: {
    name: "moderateBlog",
    method: "patch",
    endpoint: "/admin/blog/:blogId",
  },
  adminDeleteBlog: {
    name: "adminDeleteBlog",
    method: "delete",
    endpoint: "/admin/blog/:blogId",
  },
  getAllReports: {
    name: "getAllReports",
    method: "get",
    endpoint: "/admin/reports",
  },
  resolveReport: {
    name: "resolveReport",
    method: "patch",
    endpoint: "/admin/report/:reportId",
  },
  deleteReport: {
    name: "deleteReport",
    method: "delete",
    endpoint: "/admin/report/:reportId",
  },
  moderateComment: {
    name: "moderateComment",
    method: "patch",
    endpoint: "/admin/comment/:commentId",
  },
  adminDeleteComment: {
    name: "adminDeleteComment",
    method: "delete",
    endpoint: "/admin/comment/:commentId",
  },
  getAdminTotals: {
    name: "getAdminTotals",
    method: "get",
    endpoint: "/admin/dashboard/totals",
  },
  getAdminMetricsOverTime: {
    name: "getAdminMetricsOverTime",
    method: "get",
    endpoint: "/admin/dashboard/metrics-over-time",
  },
  getAdminGrowthRates: {
    name: "getAdminGrowthRates",
    method: "get",
    endpoint: "/admin/dashboard/growth-rates",
  },
  getAdminTopPerformers: {
    name: "getAdminTopPerformers",
    method: "get",
    endpoint: "/admin/dashboard/top-performers",
  },
  getTopPerformersOptions: {
    name: "getTopPerformersOptions",
    method: "get",
    endpoint: "/admin/top-performers-options",
  },
  getSpecificAnalytics: {
    name: "getSpecificAnalytics",
    method: "get",
    endpoint: "/admin/specific/analytics",
  },
};
