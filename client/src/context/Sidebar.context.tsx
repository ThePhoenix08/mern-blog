import { ALERTS_STATE_BLUEPRINT, listItemsEnum } from "@/components/ui/Sidebar";
import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";

interface SidebarContextType {
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  activeListItem: string;
  setActiveListItem: React.Dispatch<React.SetStateAction<listItemsEnum>>;
  alertState: Record<string, boolean>;
  setAlertState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error(
      "useSidebarContext must be used within a SidebarContextProvider"
    );
  }
  return context;
};

export const SidebarProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeListItem, setActiveListItem] =
    useState<listItemsEnum>("Dashboard");
  const [alertState, setAlertState] = useState(ALERTS_STATE_BLUEPRINT);

  const value: SidebarContextType = {
    isMinimized,
    setIsMinimized,
    activeListItem,
    setActiveListItem,
    alertState,
    setAlertState,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
