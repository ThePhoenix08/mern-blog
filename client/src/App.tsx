import { Home, Search, Settings } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import Moderation from "./pages/Auth/Admin/Moderation";
import Dashboard from "./pages/Auth/Blogger/Dashboard";
import Editor from "./pages/Auth/Blogger/Editor";
import Explore from "./pages/Auth/Explore/Explore";
import Feed from "./pages/Auth/Explore/Feed";
import Trending from "./pages/Auth/Explore/Trending";
import Content from "./pages/Auth/Profile/Content";
import Notifications from "./pages/Auth/Profile/Notifications";
import Profile from "./pages/Auth/Profile/Profile";
import ForgotPassword from "./pages/public/ForgotPassword";
import Login from "./pages/public/Login";
import SignUp from "./pages/public/SignUp";
import Admin from "./pages/Auth/Admin/Admin";
import Blogger from "./pages/Auth/Blogger/Blogger";
import B_Content from "./pages/Auth/Blogger/B_Content";
import A_Dashboard from "./pages/Auth/Admin/A_Dashboard";

function App() {
  const notFoundFallbackRoute = <Route path="*" element={<NotFound />} />;

  return (
    <div className="App">
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} index />
        <Route path="/public">
          <Route path="home" element={<Home />} index />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          {notFoundFallbackRoute}
        </Route>
        <Route path="/auth">
          <Route path="explore" element={<Explore />}>
            <Route path="feed" element={<Feed />} />
            <Route path="trending" element={<Trending />} index />
            <Route path="search" element={<Search />} />
            {notFoundFallbackRoute}
          </Route>
          <Route path="profile" element={<Profile />}>
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="content" element={<Content />} />
            {notFoundFallbackRoute}
          </Route>
          <Route path="blogger" element={<Blogger />}>
            <Route path="content" element={<B_Content />} />
            <Route path="edit-content" element={<Editor />} />
            <Route path="analytics" element={<Dashboard />} index />
            {notFoundFallbackRoute}
          </Route>
          <Route path="admin" element={<Admin />}>
            <Route path="analytics" element={<A_Dashboard />} />
            <Route path="moderation" element={<Moderation />} />
            {notFoundFallbackRoute}
          </Route>
          {notFoundFallbackRoute}
        </Route>
        {notFoundFallbackRoute}
      </Routes>
    </div>
  );
}

export default App;
