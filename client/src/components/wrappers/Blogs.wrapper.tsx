import React from "react";
import { Outlet } from "react-router-dom";

type Props = {};

const Blogs = (props: Props) => {
  return (
    <>
      <div>Blogs</div>
      <Outlet />
    </>
  );
};

export default Blogs;
