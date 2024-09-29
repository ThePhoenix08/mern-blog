import React from "react";
import { Outlet } from "react-router-dom";

type Props = {};

const Blog = (props: Props) => {
  return (
    <>
      <div>Blog</div>
      <Outlet />
    </>
  );
};

export default Blog;
