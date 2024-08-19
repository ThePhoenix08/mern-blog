import { Outlet } from "react-router-dom";

type Props = {};

function Admin({}: Props) {
  return (
    <div>
      Admin
      <Outlet />
    </div>
  );
}

export default Admin;
