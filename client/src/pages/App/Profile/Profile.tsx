import { Outlet } from "react-router-dom";

type Props = {};

function Profile({}: Props) {
  return (
    <div>
      Profile
      <Outlet />
    </div>
  );
}

export default Profile;
