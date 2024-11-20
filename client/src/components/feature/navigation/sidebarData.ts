import {
  Bell,
  Bookmark,
  Compass,
  CopyCheck,
  FolderPen,
  Heart,
  LayoutDashboard,
  Newspaper,
  Search,
  Settings,
  Star,
  User,
} from "lucide-react";

type SidebarGroup = {
  label: string;
  items: {
    name: string;
    url: string;
    icon: any;
    bloggerOnly?: boolean;
  }[];
};

const sidebarData: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  profile: SidebarGroup;
  Library: SidebarGroup;
  blogs: SidebarGroup;
  Brand: { label: string };
} = {
  user: {
    name: "JohnDoe08",
    email: "johndoe08@gmail.com",
    avatar: "https://avatar.iran.liara.run/public/boy",
  },
  profile: {
    label: "Profile",
    items: [
      { name: "My Profile", url: "/app/profile/JohnDoe08", icon: User },
      {
        name: "Subscribtions",
        url: "/app/profile/subscribtions",
        icon: CopyCheck,
      },
      { name: "Messages", url: "/app/profile/messages", icon: Bell },
      { name: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
      { name: "Settings", url: "/app/profile/settings", icon: Settings },
    ],
  },
  Library: {
    label: "Library",
    items: [
      { name: "Saves", url: "/app/blogs/saves", icon: Bookmark },
      { name: "Liked", url: "/app/blogs/liked", icon: Heart },
      {
        name: "My Blogs",
        url: "/app/blogs/byMe",
        icon: FolderPen,
        bloggerOnly: true,
      },
    ],
  },
  blogs: {
    label: "Blogs",
    items: [
      { name: "Explore", url: "/app/blogs/explore", icon: Compass },
      { name: "Search", url: "/app/blogs/search", icon: Search },
      { name: "Popular", url: "/app/blogs/popular", icon: Search },
      { name: "Trending", url: "/app/blogs/trending", icon: Star },
      { name: "Latest", url: "/app/blogs/latest", icon: Newspaper },
    ],
  },
  Brand: {
    label: "Bloggy | 🅱️",
  },
};

export default sidebarData;
