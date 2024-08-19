import { Outlet } from "react-router-dom";

type Props = {};

function Explore({}: Props) {
  return (
    <div>
      Explore
      <Outlet />
    </div>
  );
}

export default Explore;
