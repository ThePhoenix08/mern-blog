import { Outlet } from "react-router-dom";

type Props = {};

function Blogger({}: Props) {
  return (
    <div>
      Blogger
      <Outlet />
    </div>
  );
}

export default Blogger;
