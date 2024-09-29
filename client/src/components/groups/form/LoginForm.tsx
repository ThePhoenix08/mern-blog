import React, { useState } from "react";
import { cn } from "@/utils/classMerge.util";
import TextField from "@mui/material/TextField";
import { z } from "zod";
import Button from "@mui/material/Button/Button";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { regexPatterns, regexErrorMessages } from "./common";

const FORMDATABLUEPRINT = {
  username: "",
  email: "",
  password: "",
};

const CHECKSTATEBLUEPRINT: {
  [key: string]: { name: keyof typeof regexPatterns; state: boolean }[];
} = {
  username: [
    { name: "noSymbol", state: false },
    { name: "UsernameMinLength", state: false },
  ],
  email: [{ name: "validEmail", state: false }],
  password: [
    { name: "hasUppercase", state: false },
    { name: "hasLowercase", state: false },
    { name: "hasDigit", state: false },
    { name: "hasSymbol", state: false },
    { name: "PasswordMinLength", state: false },
    { name: "noSymbolExceptPermittedOnes", state: false }, // @ and _
  ],
};

const formSchema = z.object({
  username: z
    .string()
    .min(2, regexErrorMessages.UsernameMinLength)
    .regex(regexPatterns.noSymbol, regexErrorMessages.noSymbol),
  email: z.string().email(regexErrorMessages.validEmail),
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
});

const LoginForm = ({ styleClasses }: { styleClasses: string }) => {
  const [formState, setFormState] = useState(FORMDATABLUEPRINT);
  const [checks, setChecks] = useState(CHECKSTATEBLUEPRINT);
  const [errorMessages, setErrorMessages] =
    useState<Partial<typeof FORMDATABLUEPRINT>>(FORMDATABLUEPRINT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // methods
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
        username: formattedErrors.username?._errors[0] || "",
        email: formattedErrors.email?._errors[0] || "",
        password: formattedErrors.password?._errors[0] || "",
      });
      return false;
    }
  };
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (formDataValidator()) {
      // REQUEST => send cookies to server
      // RESPONSE => check if request was successful
      console.log("Form submitted successfully", formState);
      // ENDPOINT => /api/public/login

      // Login user
      // Redirect to app
      setErrorMessages(FORMDATABLUEPRINT);
      setChecks(CHECKSTATEBLUEPRINT);
    }
    setIsSubmitting(false);
  };
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name as keyof typeof FORMDATABLUEPRINT]: value,
    }));
    formRealtimeChecker(name as keyof typeof FORMDATABLUEPRINT, value);
  };
  const onResetHandler = () => {
    setFormState(FORMDATABLUEPRINT);
    setErrorMessages(FORMDATABLUEPRINT);
    setChecks(CHECKSTATEBLUEPRINT);
    setIsSubmitting(false);
  };

  return (
    <div className={cn("flex-container", styleClasses)}>
      <form
        onSubmit={onSubmitHandler}
        onReset={onResetHandler}
        className="form flex flex-col gap-4"
      >
        <FormControl
          fieldName="username"
          label="Username"
          type="text"
          placeholder="JohnDoe08"
          value={formState.username}
          onChangeHandler={onChangeHandler}
          errorMessage={errorMessages?.username}
        />
        <FormControl
          fieldName="email"
          label="Email Address"
          type="text"
          placeholder="johndoe@gmail.com"
          value={formState.email}
          onChangeHandler={onChangeHandler}
          errorMessage={errorMessages?.email}
        />
        <FormControl
          fieldName="password"
          label="Password"
          type="password"
          placeholder=""
          value={formState.password}
          onChangeHandler={onChangeHandler}
          errorMessage={errorMessages?.password}
        />
        <div className="flex gap-4 justify-around">
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            type="submit"
            size="large"
          >
            Submit
          </LoadingButton>
          <Button type="reset" variant="outlined" size="large">
            Reset
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
  const id = `login-${fieldName}`;

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

export default LoginForm;
