import Spline from "@splinetool/react-spline";
import LoginForm from "./forms/LoginForm";

const LoginPage = () => {
  return (
    <div className="w-[100dvw] h-[100dvh] grid grid-cols-1 lg:grid-cols-2">
      <div className="banner hidden lg:grid border-r-2">
        <div className="3d-model h-screen dark:bg-black">
          <Spline scene="https://prod.spline.design/T5NSzwUScjpueFV6/scene.splinecode" />
        </div>
      </div>
      <div className="signupform grid place-items-center p-4">
        <LoginForm classes="border-2" />
      </div>
    </div>
  );
};

export default LoginPage;
