import React from 'react'
import ForgotPasswordSvg from "@/assets/svgs/forgotPassword.svg";
import { Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import EmailForm from "@/components/groups/form/EmailForm";
import ForgotPasswordForm from "@/components/groups/form/ForgotPasswordForm";
import ResetCodeForm from "@/components/groups/form/ResetCodeForm";

function ForgotPassword() {
  return (
    <div className="grid lg:grid-cols-2 place-items-center h-screen w-screen">
      <div className="hidden lg:grid lg:w-full place-items-center h-full">
        <img src={ForgotPasswordSvg} alt="logo" className="w-5/6" />
      </div>
      <div className="formHolder grid place-items-center w-full bg-blue-marguerite-500 h-full">
        <div className="w-5/6 sm:w-full max-w-sm flex flex-col items-center justify-center gap-4 md:gap-8 p-4 md:p-8 border-2 rounded-xl border-gray-200 shadow-md bg-white">
          <Routes>
            <Route
              path="/"
              element={<EmailForm styleClasses="w-full" />}
              index
            />
            <Route
              path="/new"
              element={<ForgotPasswordForm styleClasses="w-full" />}
            />
            <Route path="/resetCode" element={<ResetCodeForm />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/success" element={<ForgotPasswordSuccess />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

const ForgotPasswordSuccess = () => {
  return <div>ForgotPasswordSuccess</div>;
};

export default ForgotPassword;