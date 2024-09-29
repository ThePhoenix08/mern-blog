import React, { useState } from "react";
import {
  regexErrorMessages,
  regexPatterns,
} from "@/components/groups/form/common";
import { z } from "zod";
import { cn } from "@/utils/classMerge.util";
import TextField from "@mui/material/TextField/TextField";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import Button from "@mui/material/Button/Button";
import { useNavigate } from "react-router-dom";

const FORMDATABLUEPRINT = {
  password: "",
  confirmPassword: "",
};

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, regexErrorMessages.PasswordMinLength)
      .regex(regexPatterns.hasUppercase, regexErrorMessages.hasUppercase)
      .regex(regexPatterns.hasLowercase, regexErrorMessages.hasLowercase)
      .regex(regexPatterns.hasDigit, regexErrorMessages.hasDigit)
      .regex(regexPatterns.hasSymbol, regexErrorMessages.hasSymbol)
      .regex(
        regexPatterns.noSymbolExceptPermittedOnes,
        regexErrorMessages.noSymbolExceptPermittedOnes
      ),
    confirmPassword: z
      .string()
      .min(8, regexErrorMessages.PasswordMinLength)
      .regex(regexPatterns.hasUppercase, regexErrorMessages.hasUppercase)
      .regex(regexPatterns.hasLowercase, regexErrorMessages.hasLowercase)
      .regex(regexPatterns.hasDigit, regexErrorMessages.hasDigit)
      .regex(regexPatterns.hasSymbol, regexErrorMessages.hasSymbol)
      .regex(
        regexPatterns.noSymbolExceptPermittedOnes,
        regexErrorMessages.noSymbolExceptPermittedOnes
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const CHECKSTATEBLUEPRINT: {
  [key: string]: { name: keyof typeof regexPatterns; state: boolean }[];
} = {
  password: [
    { name: "hasUppercase", state: false },
    { name: "hasLowercase", state: false },
    { name: "hasDigit", state: false },
    { name: "hasSymbol", state: false },
    { name: "PasswordMinLength", state: false },
    { name: "noSymbolExceptPermittedOnes", state: false }, // @ and _
  ],
  confirmPassword: [
    { name: "hasUppercase", state: false },
    { name: "hasLowercase", state: false },
    { name: "hasDigit", state: false },
    { name: "hasSymbol", state: false },
    { name: "PasswordMinLength", state: false },
    { name: "noSymbolExceptPermittedOnes", state: false }, // @ and _
  ],
};

const ForgotPasswordForm = ({ styleClasses }: { styleClasses?: string }) => {
  const [formState, setFormState] = useState(FORMDATABLUEPRINT);
  const [checks, setChecks] = useState(CHECKSTATEBLUEPRINT);
  const [errorMessages, setErrorMessages] =
    useState<Partial<typeof FORMDATABLUEPRINT>>(FORMDATABLUEPRINT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formRealtimeChecker = (
    fieldName: keyof typeof FORMDATABLUEPRINT,
    value: string
  ) => {
    const checkers = checks[fieldName];
    checkers.forEach((checker, index) => {
      const checkResult = regexPatterns[checker.name].test(value);
      setChecks((prevState) => {
        const newState = { ...prevState };
        newState[fieldName][index].state = checkResult;
        setErrorMessages((EprevState) => {
          const EnewState = { ...EprevState };
          if (!checkResult) {
            EnewState[fieldName] = regexErrorMessages[checker.name];
          } else {
            if (EprevState[fieldName] === regexErrorMessages[checker.name]) {
              delete EnewState[fieldName];
            }
          }
          return EnewState;
        });
        return newState;
      });
    });
  };
  const formDataValidator = (): boolean => {
    const validationResult = formSchema.safeParse(formState);
    if (validationResult.success) {
      return true;
    } else {
      const formattedErrors = validationResult.error.format();
      setErrorMessages({
        password: formattedErrors.password?._errors[0] || "",
        confirmPassword: formattedErrors.confirmPassword?._errors[0] || "",
      });
      return false;
    }
  };
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (formDataValidator()) {
      // REQUEST => send data to server
      // RESPONSE => check if request was successful
      console.log("Form submitted successfully", formState);
      // ENDPOINT => /api/public/forgotPassword/new
      setErrorMessages(FORMDATABLUEPRINT);
      setChecks(CHECKSTATEBLUEPRINT);
      // NAVIGATE TO => /login
      navigate("/login");
    }
    setIsSubmitting(false);
  };
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as {
      name: keyof typeof FORMDATABLUEPRINT;
      value: string;
    };
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    formRealtimeChecker(name, value);
  };
  const onResetHandler = () => {
    setFormState(FORMDATABLUEPRINT);
    setErrorMessages(FORMDATABLUEPRINT);
    setChecks(CHECKSTATEBLUEPRINT);
    setIsSubmitting(false);
  };

  return (
    <div className={cn("flex-container flex flex-col gap-4", styleClasses)}>
      <div className="heading-text flex flex-col gap-2">
        <p className="text-center text-3xl font-bold">Set New Password</p>
        <p className="text-left text-sm text-zinc-700">
          At least 8 characters long <br />
          Must contain at least the following: <br />
          <ul className="list-disc list-inside">
            <li>One uppercase letter</li>
            <li>One lowercase letter.</li>
            <li>One digit.</li>
            <li>One symbol, either @ or _.</li>
          </ul>
        </p>
      </div>
      <form
        onSubmit={onSubmitHandler}
        onReset={onResetHandler}
        className="form flex flex-col gap-4"
      >
        <FormControl
          fieldName="password"
          label="Password"
          type="password"
          placeholder=""
          value={formState.password}
          onChangeHandler={onChangeHandler}
          errorMessage={errorMessages?.password}
        />
        <FormControl
          fieldName="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder=""
          value={formState.confirmPassword}
          onChangeHandler={onChangeHandler}
          errorMessage={errorMessages?.confirmPassword}
        />
        <div className="flex gap-4 justify-around">
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            type="submit"
          >
            Reset Password
          </LoadingButton>
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate("/login")}
          >
            Back to log in
          </Button>
        </div>
      </form>
    </div>
  );
};

const FormControl: React.FC<{
  fieldName: keyof typeof FORMDATABLUEPRINT;
  label: string;
  type: "text" | "password";
  placeholder: string;
  value: string;
  isRequired?: boolean;
  onChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}> = ({
  fieldName,
  label,
  type,
  placeholder,
  value,
  isRequired,
  onChangeHandler,
  errorMessage,
}) => {
  const id = `forgotPassword-${fieldName}`;

  return (
    <div className="form-control">
      <TextField
        id={id}
        name={fieldName}
        label={label}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChangeHandler}
        required={isRequired}
        className={`form-input ${errorMessage ? "input-error" : ""}`}
        helperText={errorMessage || ""}
        error={!!errorMessage}
        color={!errorMessage && value ? "success" : "primary"}
        fullWidth
      />
    </div>
  );
};

export default ForgotPasswordForm;
