import { Routes, Route } from "react-router-dom";
import {
  authRoutes,
  appRoutes,
  blogRoutes,
  blogsRoutes,
  dashboardRoutes,
  ForgotPasswordRoutes,
} from "./routes/routes";

import ForgotPassword from "@/pages/Auth/ForgotPassword.page";
import Landing from "@/pages/Auth/Landing.page";
import Login from "@/pages/Auth/Login.page";
import NotFound from "@/pages/Auth/NotFound.page";
import SignUp from "@/pages/Auth/SignUp.page";

import Dashboard from "@/components/wrappers/Dashboard.wrapper";
import Profile from "@/pages/App/Profile.page";
import PublicProfile from "@/pages/App/PublicProfile.page";
import Settings from "@/pages/App/Settings.page";
import Blog from "@/components/wrappers/Blog.wrapper";
import Blogs from "@/components/wrappers/Blogs.wrapper";
import Subscribtions from "@/pages/App/Subscribtions.page";
import Messages from "@/pages/App/Messages.page";
import { PrivilegeLevels, RoleEnum } from "./types/data";
import { useGlobalContext } from "./context/Global.context";
import Edit from "./pages/App/blog/Edit.page";
import Read from "./pages/App/blog/Read.page";
import Explore from "./pages/App/blogs/Explore.page";
import Feed from "./pages/App/blogs/Feed.page";
import ModerateBlogs from "./pages/App/blogs/ModerateBlogs.page";
import MyBlogs from "./pages/App/blogs/MyBlogs.page";
import Popular from "./pages/App/blogs/Popular.page";
import Saved from "./pages/App/blogs/Saved.page";
import AdminDashboard from "./pages/App/dashboard/AdminDashboard.page";
import BloggerDashboard from "./pages/App/dashboard/BloggerDashboard.page";
import UserDashboard from "./pages/App/dashboard/UserDashboard.page";
import AppWrapper from "./components/wrappers/App.wrapper";
import ForgotPasswordForm from "./components/groups/form/ForgotPasswordForm";
import EmailForm from "./components/groups/form/EmailForm";
import ResetCodeForm from "./components/groups/form/ResetCodeForm";

const elementNameToElementMap: {
  [key: string]: JSX.Element;
} = {
  // auth
  Landing: <Landing />,
  Login: <Login />,
  SignUp: <SignUp />,
  ForgotPassword: <ForgotPassword />,
  NotFound: <NotFound />,
  ForgotPasswordSuccess: <ForgotPassword />,
  EmailForm: <EmailForm />,
  ForgotPasswordForm: <ForgotPasswordForm />,
  ResetCodeForm: <ResetCodeForm />,

  // app
  Dashboard: <Dashboard />,
  Profile: <Profile />,
  PublicProfile: <PublicProfile />,
  Settings: <Settings />,
  Blog: <Blog />,
  Blogs: <Blogs />,
  Subscribtions: <Subscribtions />,
  Messages: <Messages />,

  // blog
  Read: <Read />,
  Edit: <Edit />,

  // blogs
  Explore: <Explore />,
  Feed: <Feed />,
  ModerateBlogs: <ModerateBlogs />,
  MyBlogs: <MyBlogs />,
  Popular: <Popular />,
  Saved: <Saved />,

  // dashboard
  UserDashboard: <UserDashboard />,
  BloggerDashboard: <BloggerDashboard />,
  AdminDashboard: <AdminDashboard />,
};

const roleToPrivilegeMap: Record<RoleEnum, PrivilegeLevels> = {
  user: 2,
  blogger: 1,
  admin: 0,
};

function App() {
  const userRole = useGlobalContext().role;
  const UserPrivilege = roleToPrivilegeMap[userRole];

  return (
    <div className="App font-[inter]">
      <Routes>
        {authRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={elementNameToElementMap[route.elementName]}
          />
        ))}
        <Route path="forgot-password/*" element={<ForgotPassword />}>
          {ForgotPasswordRoutes.map((route, index) => (
            <Route
              key={index}
              index={route.index}
              path={route.path}
              element={elementNameToElementMap[route.elementName]}
            />
          ))}
        </Route>
        <Route path="app/*" element={<AppWrapper />}>
          {appRoutes.map((route, index) => (
            <Route
              key={index}
              index={route.index}
              path={route.path}
              element={elementNameToElementMap[route.elementName]}
            />
          ))}
          <Route path="blog/*" element={<Blog />}>
            {blogRoutes
              .filter((route) => route.privilege === UserPrivilege)
              .map((route, index) => (
                <Route
                  key={index}
                  index={route.index}
                  path={route.path}
                  element={elementNameToElementMap[route.elementName]}
                />
              ))}
          </Route>
          <Route path="blogs/*" element={<Blogs />}>
            {blogsRoutes
              .filter((route) => route.privilege === UserPrivilege)
              .map((route, index) => (
                <Route
                  key={index}
                  index={route.index}
                  path={route.path}
                  element={elementNameToElementMap[route.elementName]}
                />
              ))}
          </Route>
          <Route path="dashboard/*" element={<Dashboard />}>
            {dashboardRoutes
              .filter((route) => route.privilege === UserPrivilege)
              .map((route, index) => (
                <Route
                  key={index}
                  index={route.index}
                  path={route.path}
                  element={elementNameToElementMap[route.elementName]}
                />
              ))}
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
