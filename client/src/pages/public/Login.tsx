import React from 'react'

type Props = {}

function Login({}: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-5/6 max-w-sm flex flex-col items-center justify-center gap-4 md:gap-8 p-4 md:p-8 border-2 rounded-xl border-gray-200 shadow-md">
        <p className="text-3xl font-bold">Sign in</p>
        {/* <SignInForm styleClasses="w-full" /> */}
      </div>
    </div>
  );
}

export default Login