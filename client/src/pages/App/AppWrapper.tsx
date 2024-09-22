import Sidebar from "@/components/ui/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

type Props = {};

function AppWrapper({}: Props) {
  return (
    <div className="w-screen h-screen flex items-center">
      <Sidebar />
      <div className="h-screen flex-grow bg-babyPowder grid place-items-center">
        <Outlet />
      </div>
    </div>
  );
}

export default AppWrapper;
