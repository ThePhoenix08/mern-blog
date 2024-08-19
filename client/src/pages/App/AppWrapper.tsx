import React from "react";
import { Outlet } from "react-router-dom";

type Props = {};

function AppWrapper({}: Props) {
  return (
    <div>
      AppWrapper
      <Outlet />
    </div>
  );
}

export default AppWrapper;
