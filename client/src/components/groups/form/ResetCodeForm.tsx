import { cn } from "@/utils/classMerge.util";
import { useNavigate } from "react-router-dom";
import { OTPInput } from "input-otp";
import type { SlotProps } from "input-otp";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import Button from "@mui/material/Button/Button";
import { useState } from "react";

const ResetCodeForm = ({ styleClasses }: { styleClasses?: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const onCompleteHandler = () => {
    const onlyDigits = /^\d{6}$/;
    if (onlyDigits.test(otp) && otp.length === 6) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
      return;
    }
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // REQUEST => send data to server
    // RESPONSE => check if request was successful
    console.log("Form submitted successfully", otp);
    // ENDPOINT => /api/public/forgotPassword/resetCode
    setIsSubmitting(false);
    navigate("/forgot-password/new");
  };

  return (
    <div className={cn("flex-container flex flex-col gap-4", styleClasses)}>
      <div className="heading-text flex flex-col gap-2">
        <p className="text-center text-3xl font-bold">Password Reset</p>
        <p className="text-center text-sm text-zinc-700">
          We sent a code to {/* {userEmail} */}
        </p>
      </div>
      <form onSubmit={onSubmitHandler} className="form flex flex-col gap-4">
        <OTPForm
          onCompleteFunc={onCompleteHandler}
          otpState={otp}
          otpSetter={setOtp}
          isCompleteSetter={setIsComplete}
        />
        <div className="flex gap-4 justify-around">
          <LoadingButton
            loading={isSubmitting}
            disabled={!isComplete}
            variant="contained"
            type="submit"
          >
            Continue
          </LoadingButton>
          <Button type="button" variant="outlined" disabled={isSubmitting}>
            Resend Code
          </Button>
        </div>
        <div className="text-center text-sm text-zinc-700">
          <a href="/login">Back to log in</a>
        </div>
      </form>
    </div>
  );
};

const OTPForm = ({
  onCompleteFunc,
  otpState,
  otpSetter,
  isCompleteSetter,
}: {
  onCompleteFunc: () => void;
  otpState: string;
  otpSetter: React.Dispatch<React.SetStateAction<string>>;
  isCompleteSetter: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="otp-form">
      <OTPInput
        maxLength={6}
        containerClassName="OTP-input-container"
        className="focus-visible:ring-0"
        onChange={(newValue) => {
          otpSetter(newValue);
          if (newValue.length !== 6) {
            isCompleteSetter(false);
          }
        }}
        onComplete={() => onCompleteFunc()}
        value={otpState}
        render={({ slots }) => (
          <>
            <div className="flex">
              {slots.slice(0, 6).map((slot, index) => (
                <Slot key={index} {...slot} />
              ))}
            </div>
          </>
        )}
      />
    </div>
  );
};

export default ResetCodeForm;

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative w-10 h-14 text-[2rem]",
        "flex items-center justify-center",
        "transition-all duration-300",
        "border-y border-r first:border-l first:rounded-l-md last:rounded-r-md",
        "group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20",
        "outline outline-0 outline-accent-foreground/20",
        { "outline-1 outline-accent-foreground": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
