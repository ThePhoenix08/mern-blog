import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";
import { RoleEnum } from "@/lib/common_data.util";
import { IUser } from "@/types/user.d";

interface GlobalContextType {
  user: Partial<IUser>;
  setUser: React.Dispatch<React.SetStateAction<Partial<IUser>>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  role: RoleEnum;
  setRole: React.Dispatch<React.SetStateAction<RoleEnum>>;
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  activeRoute: string;
  setActiveRoute: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};

export const GlobalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<Partial<IUser>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<RoleEnum>("user");
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/app/explore");

  const value: GlobalContextType = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    role,
    setRole,
    isMobile,
    setIsMobile,
    isDarkMode,
    setIsDarkMode,
    activeRoute,
    setActiveRoute,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
