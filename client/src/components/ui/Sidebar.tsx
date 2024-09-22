import React, { useState, createContext, useContext } from "react";
import logoSVG from "@/assets/svgs/logo.svg";

// logos
import {
  MdDashboard, // admin dashboard
  MdAdminPanelSettings, // admin moderation
  MdMessage, // messages
  MdOutlineBookmark, // saved
  MdExplore, // explore
  MdArticle, // my blog
  MdLibraryAddCheck, // subscribtions
  MdEditDocument, // editor
} from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si"; // blogger analytics
import { IoMdSettings } from "react-icons/io"; // settings
import { FaSignOutAlt } from "react-icons/fa"; // logout
import { MdOutlineMoreVert } from "react-icons/md"; // options
import { FaCircle } from "react-icons/fa"; // notifications
import { LuMenu } from "react-icons/lu"; // burger menu
import { IoIosClose } from "react-icons/io"; // close
import { RoleEnum } from "@/lib/common_data.util";
import Divider from "@mui/material/Divider/Divider";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "../brand/Logo";

type listItemsEnum =
  | "Explore"
  | "My Saved"
  | "My Subscribtions"
  | "Messages"
  | "My Blogs"
  | "Dashboard"
  | "Settings"
  | "Logout"
  | "Moderation"
  | "Editor"
  | "Reader";

const locationToListItemMap: Record<string, listItemsEnum> = {
  explore: "Explore",
  saves: "My Saved",
  subscribtions: "My Subscribtions",
  notifications: "Messages",
  "my-blogs": "My Blogs",
  analytics: "Dashboard",
  settings: "Settings",
  login: "Logout",
  moderation: "Moderation",
  editor: "Editor",
  reader: "Reader",
};

/* const Sidebar = () => {
  const [role, setRole] = useState<RoleEnum>("blogger");
  let { pathname } = useLocation();
  const pathSegment = pathname.split("/").pop() as string;
  const [activeListItem, setActiveListItem] = useState<listItemsEnum>(
    locationToListItemMap[pathSegment]
  );

  const [isMinimized, setIsMinimized] = useState(true);

  // nested component
  const ListItemBox = ({
    icon,
    text,
    link,
  }: {
    icon: JSX.Element;
    text: listItemsEnum;
    link: string;
  }) => {
    const handleListItemClick = (text: listItemsEnum) => {
      setActiveListItem(text);
    };

    return (
      <li
        className="menu-link w-full"
        onClick={() => handleListItemClick(text)}
      >
        <Link
          to={link}
          className={cn(
            "menu-link w-full flex items-center p-4",
            `${activeListItem === text ? "bg-blue-marguerite-500 text-babyPowder" : "hover:bg-blue-marguerite-200"}`
          )}
        >
          <div
            className={cn(
              "w-5 h-5 lg:w-8 lg:h-8 sm:text-xl md:text-2xl lg:text-3xl grid place-items-center",
              "text-blue-marguerite-400",
              `${activeListItem === text && "text-babyPowder"}`
            )}
          >
            {icon}
          </div>
          <div className={`ml-2 ${isMinimized ? "hidden" : ""}`}>{text}</div>
        </Link>
      </li>
    );
  };

  return (
    <div
      className={`sidebar-container max-w-96 lg:w-1/4 h-screen bg-gray-200 ${isMinimized ? "sm:max-w-fit" : ""}`}
    >
      <div className="logo-container">
        <Logo />
      </div>
      <div className="burger-container">
        <div className="burger-line"></div>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
      </div>
      <nav className="menu-container">
        <ul>
          <ListItemBox
            icon={<MdExplore />}
            text="Explore"
            link="/app/explore"
          />
          <ListItemBox
            icon={<MdOutlineBookmark />}
            text="My Saved"
            link="/app/profile/saves"
          />
          <ListItemBox
            icon={<MdLibraryAddCheck />}
            text="My Subscribtions"
            link="/app/profile/subscribtions"
          />
          <ListItemBox
            icon={<MdMessage />}
            text="Messages"
            link="/app/profile/notifications"
          />
          {role === "blogger" && (
            <>
              {isMinimized ? <Divider /> : <Divider>Blogger</Divider>}

              <ListItemBox
                icon={<MdArticle />}
                text="My Blogs"
                link="/app/blogger/my-blogs"
              />
              <ListItemBox
                icon={<MdEditDocument />}
                text="Editor"
                link="/app/blogger/editor"
              />
              <ListItemBox
                icon={<SiGoogleanalytics />}
                text="Dashboard"
                link="/app/blogger/analytics"
              />
            </>
          )}
          {role === "admin" && (
            <>
              {isMinimized ? <Divider /> : <Divider>Admin</Divider>}
              <ListItemBox
                icon={<MdAdminPanelSettings />}
                text="Moderation"
                link="/app/admin/moderation"
              />
              <ListItemBox
                icon={<MdDashboard />}
                text="Dashboard"
                link="/app/admin/analytics"
              />
            </>
          )}
          <Divider />
          <ListItemBox
            icon={<IoMdSettings />}
            text="Settings"
            link="/app/profile/settings"
          />
          <ListItemBox icon={<FaSignOutAlt />} text="Logout" link="/login" />
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; */

type SidebarItemProps = {
  icon: JSX.Element;
  text: listItemsEnum;
  link: string;
};

const CommonSidebarItems: SidebarItemProps[] = [
  {
    icon: <MdExplore />,
    text: "Explore",
    link: "/app/explore",
  },
  {
    icon: <MdOutlineBookmark />,
    text: "My Saved",
    link: "/app/profile/saves",
  },
  {
    icon: <MdLibraryAddCheck />,
    text: "My Subscribtions",
    link: "/app/profile/subscribtions",
  },
  {
    icon: <MdMessage />,
    text: "Messages",
    link: "/app/profile/notifications",
  },
];

const UserSidebarItems: SidebarItemProps[] = [
  {
    icon: <MdArticle />,
    text: "Reader",
    link: "/app/reader",
  },
];

const AdminSidebarItems: SidebarItemProps[] = [
  {
    icon: <MdDashboard />,
    text: "Dashboard",
    link: "/app/admin/analytics",
  },
  {
    icon: <MdEditDocument />,
    text: "Editor",
    link: "/app/blogger/editor",
  },
  {
    icon: <MdAdminPanelSettings />,
    text: "Moderation",
    link: "/app/admin/moderation",
  },
];

const BloggerSidebarItems: SidebarItemProps[] = [
  {
    icon: <SiGoogleanalytics />,
    text: "Dashboard",
    link: "/app/blogger/analytics",
  },
  {
    icon: <MdEditDocument />,
    text: "Editor",
    link: "/app/blogger/editor",
  },
  {
    icon: <MdArticle />,
    text: "My Blogs",
    link: "/app/blogger/my-blogs",
  },
];

const ALERTS_STATE_BLUEPRINT: Record<listItemsEnum, boolean> = {
  "My Saved": false,
  "My Subscribtions": false,
  Messages: false,
  "My Blogs": false,
  Dashboard: false,
  Settings: false,
  Logout: false,
  Moderation: false,
  Editor: false,
  Reader: false,
  Explore: false,
};

const SidebarContext = createContext({
  isMinimized: false,
  activeListItem: locationToListItemMap["explore"],
  alertState: ALERTS_STATE_BLUEPRINT,
  setActiveListItem: (target: listItemsEnum) => {},
});

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [role, setRole] = useState<RoleEnum>("user");
  const [activeListItem, setActiveListItem] = useState<listItemsEnum>(
    locationToListItemMap["explore"]
  );
  const [alertState, setAlertState] = useState<Record<listItemsEnum, boolean>>(
    ALERTS_STATE_BLUEPRINT
  );

  if (isMobile) {
    return <div>mobile</div>;
  } else {
    return (
      <aside
        className={cn(
          "sidebar-container max-w-96 lg:w-1/5 h-screen position-fixed left-0 top-0 bottom-0",
          `${isMinimized && "sm:max-w-fit"}`
        )}
      >
        <nav className="h-full flex flex-col bg-gray-200 border-r shadow-sm gap-4">
          <div className="logo-container">
            <Link to={"/app/explore"}>
              <Logo state={isMinimized} />
            </Link>
          </div>
          <div
            className="burger-container relative top-0 w-10 lg:w-16 h-10 lg:h-16"
            style={!isMobile && { left: "calc(100% - 2rem)" }}
          >
            <div
              className="burger-bg-curve bg-babyPowder rounded-full grid place-items-center"
              style={
                !isMobile && {
                  height: "calc(100% + 0.1rem)",
                  width: "calc(100% + 0.1rem)",
                }
              }
            >
              <div
                className={cn(
                  "burger-box bg-tomato-500 rounded-full w-8 lg:w-12 h-8 lg:h-12 transition-all duration-200 cursor-pointer",
                  "grid place-items-center hover:shadow-sm shadow-2xl shadow-tomato-500 active:-rotate-90"
                )}
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <LuMenu className="w-3/4 h-3/4 text-white" />
                ) : (
                  <IoIosClose className="w-3/4 h-3/4 text-white" />
                )}
              </div>
            </div>
          </div>
          <SidebarContext.Provider
            value={{
              alertState,
              activeListItem,
              isMinimized,
              setActiveListItem,
            }}
          >
            <ul className="menu-container flex-1 flex flex-col gap-2">
              {CommonSidebarItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  link={item.link}
                />
              ))}
              {role === "user" && (
                <>
                  {isMinimized ? <Divider /> : <Divider>User</Divider>}
                  {UserSidebarItems.map((item, index) => (
                    <SidebarItem
                      key={index}
                      icon={item.icon}
                      text={item.text}
                      link={item.link}
                    />
                  ))}
                </>
              )}
              {role === "blogger" && (
                <>
                  {isMinimized ? <Divider /> : <Divider>Blogger</Divider>}
                  {BloggerSidebarItems.map((item, index) => (
                    <SidebarItem
                      key={index}
                      icon={item.icon}
                      text={item.text}
                      link={item.link}
                    />
                  ))}
                </>
              )}
              {role === "admin" && (
                <>
                  {isMinimized ? <Divider /> : <Divider>Admin</Divider>}
                  {AdminSidebarItems.map((item, index) => (
                    <SidebarItem
                      key={index}
                      icon={item.icon}
                      text={item.text}
                      link={item.link}
                    />
                  ))}
                </>
              )}
            </ul>
          </SidebarContext.Provider>
          <div className="profile-container flex items-center gap-2 py-4 px-2">
            <div className="avatar-container p-2">
              <img
                src="https://avatar.iran.liara.run/username?username=John+Doe"
                alt="user avatar"
                className="w-16 h-16 rounded-full"
              />
            </div>
            {!isMinimized && (
              <>
                <div className="profile-content flex flex-col justify-center">
                  <p className="name text-2xl">John Doe</p>
                  <p className="email text-sm">johndoe@gmail.com</p>
                </div>
                <div className="grid place-items-center ml-8 text-3xl">
                  <MdOutlineMoreVert />
                </div>
              </>
            )}
          </div>
        </nav>
      </aside>
    );
  }
};

const SidebarItem = ({
  icon,
  text,
  link,
}: {
  icon: JSX.Element;
  text: listItemsEnum;
  link: string;
}): JSX.Element => {
  const {
    alertState,
    activeListItem,
    isMinimized: state,
    setActiveListItem,
  } = useContext(SidebarContext);
  const active = activeListItem === text;
  const alert = alertState[text];
  return (
    <li>
      <Link
        to={link}
        className={cn(
          "menu-link w-full flex items-center p-4",
          "cursor-pointer transition-all text-xl",
          `${
            active
              ? "bg-gradient-to-tr from-blue-marguerite-200 to-blue-marguerite-100 text-black"
              : "hover:bg-babyPowder text-gray-600"
          }`
        )}
        onClick={() => setActiveListItem(text)}
      >
        <div className={`w-full flex items-center gap-4`}>
          <span className="text-blue-marguerite-500 text-3xl ml-4">{icon}</span>
          <span className={`${state && "hidden"}`}>{text}</span>
        </div>
        {alert && <FaCircle className="text-sm text-red-500" />}
      </Link>
    </li>
  );
};

export default Sidebar;
