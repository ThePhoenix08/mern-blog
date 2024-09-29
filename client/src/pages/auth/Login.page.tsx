import LoginSvg from "@/assets/svgs/loginDoor.svg";
import LoginForm from "@/components/groups/form/LoginForm";

type Props = {};

function Login({}: Props) {
  return (
    <div className="grid lg:grid-cols-2 place-items-center h-screen w-screen">
      <div className="hidden lg:grid lg:w-full place-items-center h-full">
        <img src={LoginSvg} alt="logo" className="w-5/6" />
      </div>
      <div className="formHolder grid place-items-center w-full bg-blue-marguerite-500 h-full">
        <div className="w-5/6 sm:w-full max-w-sm flex flex-col items-center justify-center gap-4 md:gap-8 p-4 md:p-8 border-2 rounded-xl border-gray-200 shadow-md bg-white">
          <p className="text-3xl font-bold">Login</p>
          <LoginForm styleClasses="w-full" />
        </div>
      </div>
    </div>
  );
}

export default Login;
