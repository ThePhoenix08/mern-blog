import { Routes, Route } from "react-router-dom";
import Moderation from "./pages/App/Admin/Moderation";
import Dashboard from "./pages/App/Blogger/Dashboard";
import Editor from "./pages/App/Blogger/Editor";
import Explore from "./pages/App/Explore/Explore";
import Feed from "./pages/App/Explore/Feed";
import Trending from "./pages/App/Explore/Trending";
import Content from "./pages/App/Profile/Content";
import Notifications from "./pages/App/Profile/Notifications";
import Profile from "./pages/App/Profile/Profile";
import ForgotPassword from "./pages/public/ForgotPassword";
import Login from "./pages/public/Login";
import SignUp from "./pages/public/SignUp";
import Admin from "./pages/App/Admin/Admin";
import Blogger from "./pages/App/Blogger/Blogger";
import B_Content from "./pages/App/Blogger/B_Content";
import A_Dashboard from "./pages/App/Admin/A_Dashboard";
import NotFound from "./pages/public/NotFound";
import Home from "./pages/public/Home";
import Search from "./pages/App/Explore/Search";
import Settings from "./pages/App/Profile/Settings";
import AppWrapper from "./pages/App/AppWrapper";

function App() {
  const notFoundFallbackRoute = <Route path="*" element={<NotFound />} />;

  return (
    <div className="App">
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} index />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="/app" element={<AppWrapper />}>
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
