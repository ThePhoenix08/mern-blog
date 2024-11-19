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
  | "getSpecificAnalytics"
  | "getSubscribedTo";

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
    endpoint: "/auth/account/refreshUser",
  },
  resetPassword: {
    name: "resetPassword",
    method: "post",
    endpoint: "/auth/account/resetPassword",
  },
  logout: {
    name: "logout",
    method: "post",
    endpoint: "/auth/account/logout",
  },
  getProfile: {
    name: "getProfile",
    method: "get",
    endpoint: "/auth/users/profile",
  },
  updateProfile: {
    name: "updateProfile",
    method: "patch",
    endpoint: "/auth/users/profile",
  },
  deleteProfile: {
    name: "deleteProfile",
    method: "delete",
    endpoint: "/auth/users/profile",
  },
  uploadAvatar: {
    name: "uploadAvatar",
    method: "post",
    endpoint: "/auth/users/avatar",
  },
  toggleSubscribeToBlogger: {
    name: "toggleSubscribeToBlogger",
    method: "put",
    endpoint: "/auth/users/subscribe/:bloggerId",
  },
  getSubscribedTo: {
    name: "getSubscribedTo",
    method: "get",
    endpoint: "/auth/users/subscribedTo",
  },
  getUserComments: {
    name: "getUserComments",
    method: "post",
    endpoint: "/auth/users/myComments",
  },
  getUserPublicProfile: {
    name: "getUserPublicProfile",
    method: "get",
    endpoint: "/auth/users/publicProfile/:userId",
  },
  getUserSettings: {
    name: "getUserSettings",
    method: "get",
    endpoint: "/auth/users/settings",
  },
  updateUserSettings: {
    name: "updateUserSettings",
    method: "patch",
    endpoint: "/auth/users/settings",
  },
  getBlogs: {
    name: "getBlogs",
    method: "get",
    endpoint: "/auth/blogger/posts",
  },
  deleteBlogs: {
    name: "deleteBlogs",
    method: "delete",
    endpoint: "/auth/blogger/posts",
  },
  createBlog: {
    name: "createBlog",
    method: "post",
    endpoint: "/auth/blogger/posts",
  },
  getBlog: {
    name: "getBlog",
    method: "get",
    endpoint: "/auth/blogger/blog/:id",
  },
  updateBlog: {
    name: "updateBlog",
    method: "patch",
    endpoint: "/auth/blogger/blog/:id",
  },
  deleteBlog: {
    name: "deleteBlog",
    method: "delete",
    endpoint: "/auth/blogger/blog/:id",
  },
  updateBloggerProfile: {
    name: "updateProfile",
    method: "patch",
    endpoint: "/auth/blogger/updateProfile",
  },
  uploadCoverImage: {
    name: "uploadCoverImage",
    method: "post",
    endpoint: "/auth/blogger/cover",
  },
  getBloggerSpecificAnalytics: {
    name: "getBloggerSpecificAnalytics",
    method: "get",
    endpoint: "/auth/blogger/specificAnalytics",
  },
  getManyBlogs: {
    name: "getBlogs",
    method: "get",
    endpoint: "/auth/content/posts",
  },
  getBlogTags: {
    name: "getBlogTags",
    method: "get",
    endpoint: "/auth/content/tags",
  },
  toggleBlogSave: {
    name: "toggleBlogSave",
    method: "put",
    endpoint: "/auth/content/blog/:id",
  },
  getComments: {
    name: "getComments",
    method: "get",
    endpoint: "/auth/content/comments/:blogId",
  },
  addComment: {
    name: "addComment",
    method: "post",
    endpoint: "/auth/content/comments/:blogId",
  },
  updateComment: {
    name: "updateComment",
    method: "patch",
    endpoint: "/auth/content/comments/:blogId/:commentId",
  },
  deleteComment: {
    name: "deleteComment",
    method: "delete",
    endpoint: "/auth/content/comments/:blogId/:commentId",
  },
  createReport: {
    name: "createReport",
    method: "post",
    endpoint: "/auth/reports/new",
  },
  getNotifs: {
    name: "getNotifs",
    method: "get",
    endpoint: "/auth/reports/notifs",
  },
  markAsRead: {
    name: "markAsRead",
    method: "put",
    endpoint: "/auth/reports/notifs/:notifId",
  },
  deleteNotif: {
    name: "deleteNotif",
    method: "delete",
    endpoint: "/auth/reports/notifs/:notifId",
  },
  getAllUsers: {
    name: "getAllUsers",
    method: "get",
    endpoint: "/auth/admin/users",
  },
  updateUserRole: {
    name: "updateUserRole",
    method: "patch",
    endpoint: "/auth/admin/user/:userId",
  },
  banUser: {
    name: "banUser",
    method: "delete",
    endpoint: "/auth/admin/user/:userId",
  },
  getAllBlogs: {
    name: "getAllBlogs",
    method: "get",
    endpoint: "/auth/admin/blogs",
  },
  moderateBlog: {
    name: "moderateBlog",
    method: "patch",
    endpoint: "/auth/admin/blog/:blogId",
  },
  adminDeleteBlog: {
    name: "adminDeleteBlog",
    method: "delete",
    endpoint: "/auth/admin/blog/:blogId",
  },
  getAllReports: {
    name: "getAllReports",
    method: "get",
    endpoint: "/auth/admin/reports",
  },
  resolveReport: {
    name: "resolveReport",
    method: "patch",
    endpoint: "/auth/admin/report/:reportId",
  },
  deleteReport: {
    name: "deleteReport",
    method: "delete",
    endpoint: "/auth/admin/report/:reportId",
  },
  moderateComment: {
    name: "moderateComment",
    method: "patch",
    endpoint: "/auth/admin/comment/:commentId",
  },
  adminDeleteComment: {
    name: "adminDeleteComment",
    method: "delete",
    endpoint: "/auth/admin/comment/:commentId",
  },
  getAdminTotals: {
    name: "getAdminTotals",
    method: "get",
    endpoint: "/auth/admin/dashboard/totals",
  },
  getAdminMetricsOverTime: {
    name: "getAdminMetricsOverTime",
    method: "get",
    endpoint: "/auth/admin/dashboard/metrics-over-time",
  },
  getAdminGrowthRates: {
    name: "getAdminGrowthRates",
    method: "get",
    endpoint: "/auth/admin/dashboard/growth-rates",
  },
  getAdminTopPerformers: {
    name: "getAdminTopPerformers",
    method: "get",
    endpoint: "/auth/admin/dashboard/top-performers",
  },
  getTopPerformersOptions: {
    name: "getTopPerformersOptions",
    method: "get",
    endpoint: "/auth/admin/top-performers-options",
  },
  getSpecificAnalytics: {
    name: "getSpecificAnalytics",
    method: "get",
    endpoint: "/auth/admin/specific/analytics",
  },
};
