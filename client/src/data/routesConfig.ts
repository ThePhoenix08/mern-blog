// Components
import Profile from "../components/Profile";
import Posts from "../components/Posts";
import Blog from "../components/Blog";
import CreateBlog from "../components/Blogger/CreateBlog";
import EditBlog from "../components/Blogger/EditBlog";
import Dashboard from "../components/Blogger/Dashboard";
import Users from "../components/Admin/Users";
import EditUser from "../components/Admin/EditUser";

export enum PrivilegeLevel {
  User = 2,
  Blogger = 1,
  Admin = 0,
}

interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
}

let routesConfig: Record<PrivilegeLevel, RouteConfig[]> = {
  [PrivilegeLevel.User]: [],
  [PrivilegeLevel.Blogger]: [],
  [PrivilegeLevel.Admin]: [],
};

routesConfig = {
  [PrivilegeLevel.User]: [
    { path: "profile", component: Profile },
    { path: "posts", component: Posts },
    { path: "posts/:id", component: Blog },
  ],
  [PrivilegeLevel.Blogger]: [
    ...routesConfig[PrivilegeLevel.User],
    { path: "posts/create", component: CreateBlog },
    { path: "posts/edit/:id", component: EditBlog },
    { path: "dashboard", component: Dashboard },
  ],
  [PrivilegeLevel.Admin]: [
    ...routesConfig[PrivilegeLevel.Blogger],
    { path: "users", component: Users },
    { path: "users/edit/:id", component: EditUser },
  ],
};

export default routesConfig;
