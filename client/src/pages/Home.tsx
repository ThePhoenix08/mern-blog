import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

type Props = {
  renderedAs: "component" | "index";
};

function Home({ renderedAs }: Props) {
  return (
    <div>
      <Sidebar />
      {renderedAs === "component" && <Outlet />}
    </div>
  );
}

export default Home;
