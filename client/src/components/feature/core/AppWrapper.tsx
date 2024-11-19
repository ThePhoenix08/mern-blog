import { Link, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/feature/navigation/AppSidebar";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth, setUserCreds } from "@/redux/slices/authSlice";
import { useEffect } from "react";
import { refreshUser } from "./api/RefreshUser";

const AppWrapper = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    const validateSession = async () => {
      try {
        const user = await refreshUser();
        dispatch(setUserCreds({ user, isVerified: false, isAuth: true }));
      } catch (error) {
        console.log(error);
        dispatch(logout());
      }
    };
    validateSession();
  }, []);

  return (
    <>
      {isAuth ? (
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full h-screen p-2 md:pl-0 overflow-y-scroll no-scrollbar">
            <SidebarTrigger className="lg:hidden" />
            <div className="core h-full grid place-items-center">
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
      ) : (
        <>
          <h1>You are not logged in</h1>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </>
      )}
    </>
  );
};

export default AppWrapper;
