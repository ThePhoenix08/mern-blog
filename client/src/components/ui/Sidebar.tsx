import { useState, createContext, useContext } from "react";

// logos
import type { RoleEnum } from "@/types/data";
import Divider from "@mui/material/Divider/Divider";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/classMerge.util";
import Logo from "../brand/Logo";

// icons
import {
  MdDashboard,
  MdBookmark,
  MdExplore,
  MdLibraryAddCheck,
  MdMessage,
  MdClose,
  MdOutlineMenuOpen,
  MdCircle,
  MdOutlineMoreVert,
} from "react-icons/md";
import { useSidebarContext } from "@/context/Sidebar.context";
import { useGlobalContext } from "@/context/Global.context";
import { invertKeyValues } from "@/utils/invertKeyValue.util";

export type listItemsEnum =
  | "Dashboard"
  | "Read"
  | "Explore"
  | "Subscriptions"
  | "Messages";

const SidebarItems: listItemsEnum[] = [
  "Dashboard",
  "Read",
  "Explore",
  "Subscriptions",
  "Messages",
];

const locationToListItemMap: Record<string, listItemsEnum> = {
  "/app/dashboard": "Dashboard",
  "/app/blog/1/read": "Read",
  "/app/blogs/explore": "Explore",
  "/app/subscribtions": "Subscriptions",
  "/app/messages": "Messages",
};

const SidebarIconsMap: Record<listItemsEnum, JSX.Element> = {
  Dashboard: <MdDashboard />,
  Read: <MdBookmark />,
  Explore: <MdExplore />,
  Subscriptions: <MdLibraryAddCheck />,
  Messages: <MdMessage />,
};

export const ALERTS_STATE_BLUEPRINT: Record<listItemsEnum, boolean> = {
  Dashboard: false,
  Read: false,
  Explore: false,
  Subscriptions: false,
  Messages: false,
};

const Sidebar = () => {
  const { pathname } = useLocation();
  const { isMinimized, setIsMinimized, activeListItem, setActiveListItem } =
    useSidebarContext();
  const { user, role, isMobile } = useGlobalContext();
  setActiveListItem(locationToListItemMap[pathname]);
  const ListItemToLocation = invertKeyValues(locationToListItemMap);

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
                  <MdOutlineMenuOpen className="w-3/4 h-3/4 text-white" />
                ) : (
                  <MdClose className="w-3/4 h-3/4 text-white" />
                )}
              </div>
            </div>
          </div>
          <ul className="menu-container flex-1 flex flex-col gap-2">
            {/* sidebar items */}
            {SidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={SidebarIconsMap[item]}
                text={item}
                link={ListItemToLocation[item]}
              />
            ))}
          </ul>
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
  } = useSidebarContext();
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
        {alert && <MdCircle className="text-sm text-red-500" />}
      </Link>
    </li>
  );
};

export default Sidebar;
