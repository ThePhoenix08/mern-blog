import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/feature/navigation/AppSidebar";

const AppWrapper = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full h-screen p-2 overflow-hidden">
          <SidebarTrigger className="lg:hidden" />
          <div className="core h-full grid place-items-center rounded-md bg-zinc-900 border-[1px]">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default AppWrapper;
