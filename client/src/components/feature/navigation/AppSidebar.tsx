import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import sidebarData from "./sidebarData";
import { NavUser } from "./nav-user";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export function AppSidebar() {
  const { open } = useSidebar();
  const { pathname } = useLocation();
  const [activeItem, setActiveItem] = useState(pathname);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="flex flex-row justify-between items-center gap-2">
        {open && <span>{sidebarData.Brand.label}</span>}
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupModel
          label={sidebarData.profile.label}
          items={sidebarData.profile.items}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
        <SidebarGroupModel
          label={sidebarData.blogs.label}
          items={sidebarData.blogs.items}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
        <SidebarGroupModel
          label={sidebarData.Library.label}
          items={sidebarData.Library.items}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

const SidebarGroupModel = ({
  label,
  items,
  activeItem,
  onItemClick,
}: {
  label: string;
  items: {
    name: string;
    url: string;
    icon: any;
  }[];
  activeItem: string;
  onItemClick: (item: string) => void;
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = activeItem === item.url;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <a
                    href={item.url}
                    className={cn(
                      "hover:translate-x-2 transition-transform duration-300",
                      isActive && "translate-x-2"
                    )}
                    onClick={() => onItemClick(item.name)}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
