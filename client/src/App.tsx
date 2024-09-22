import { Routes, Route } from "react-router-dom";
import Moderation from "./pages/App/Admin/Moderation";
import Dashboard from "./pages/App/Blogger/Dashboard";
import Editor from "./pages/App/Blogger/Editor";
import Explore from "./pages/App/Explore/Explore";
import Feed from "./pages/App/Explore/Feed";
import Trending from "./pages/App/Explore/Trending";
import Notifications from "./pages/App/Profile/Notifications";
import Profile from "./pages/App/Profile/Profile";
import ForgotPassword from "./pages/public/ForgotPassword";
import Login from "./pages/public/Login";
import SignUp from "./pages/public/SignUp";
import Admin from "./pages/App/Admin/Admin";
import Blogger from "./pages/App/Blogger/Blogger";
import A_Dashboard from "./pages/App/Admin/A_Dashboard";
import NotFound from "./pages/public/NotFound";
import Home from "./pages/public/Home";
import Search from "./pages/App/Explore/Search";
import Settings from "./pages/App/Profile/Settings";
import AppWrapper from "./pages/App/AppWrapper";
import SavedBlogs from "./pages/App/Profile/SavedBlogs";
import MySubscribtions from "./pages/App/Profile/MySubscribtions";
import MyBlogs from "./pages/App/Blogger/MyBlogs";
import Reader from "./pages/App/Reader";

function App() {
  const notFoundFallbackRoute = (fallback: string) => (
    <Route path="*" element={<NotFound fallback={fallback} />} />
  );

  return (
    <div className="App font-[inter]">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} index />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password/*" element={<ForgotPassword />} />

        {/* Authenticated Routes */}
        <Route path="/app" element={<AppWrapper />}>
          <Route path="explore" element={<Explore />}>
            <Route path="feed" element={<Feed />} />
            <Route path="trending" element={<Trending />} index />
            <Route path="search" element={<Search />} />
          </Route>
          <Route path="profile" element={<Profile />}>
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="saves" element={<SavedBlogs />} />
            <Route path="subscribtions" element={<MySubscribtions />} />
          </Route>
          <Route path="reader" element={<Reader />} />
          <Route path="blogger" element={<Blogger />}>
            <Route path="my-blogs" element={<MyBlogs />} />
            <Route path="editor" element={<Editor />} />
            <Route path="analytics" element={<Dashboard />} />
          </Route>
          <Route path="admin" element={<Admin />}>
            <Route path="analytics" element={<A_Dashboard />} />
            <Route path="moderation" element={<Moderation />} />
          </Route>
        </Route>
        {notFoundFallbackRoute("/")}
      </Routes>
    </div>
  );
}

export default App;
