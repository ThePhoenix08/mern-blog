import SignUpForm from "@/components/groups/form/SignUpForm";
import SignUpSvg from "@/assets/svgs/signUp.svg";

type Props = {};

function SignUp({}: Props) {
  return (
    <div className="grid lg:grid-cols-2 place-items-center h-screen w-screen">
      <div className="hidden lg:grid lg:w-full place-items-center h-full">
        <img src={SignUpSvg} alt="logo" className="w-5/6" />
      </div>
      <div className="formHolder grid place-items-center w-full bg-pallete_primary h-full">
        <div className="w-5/6 sm:w-full max-w-sm flex flex-col items-center justify-center gap-4 md:gap-8 p-4 md:p-8 border-2 rounded-xl border-gray-200 shadow-md bg-white">
          <p className="text-3xl font-bold">Sign Up</p>
          <SignUpForm styleClasses="w-full" />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
