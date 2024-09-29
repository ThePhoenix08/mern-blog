import React, { useState } from "react";
import { z } from "zod";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { cn } from "@/utils/classMerge.util";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { regexErrorMessages, regexPatterns } from "./common";

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, regexErrorMessages.UsernameMinLength)
      .regex(regexPatterns.noSymbol, regexErrorMessages.noSymbol),
    email: z.string().email(regexErrorMessages.validEmail),
    fullName: z
      .string()
      .min(2, regexErrorMessages.FullNameMinLength)
      .regex(/^[a-zA-Z\s]*$/, "No symbols or digits allowed in full name"),
    password: z
      .string()
      .min(8)
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
      .min(8)
      .regex(regexPatterns.hasUppercase, regexErrorMessages.hasUppercase)
      .regex(regexPatterns.hasLowercase, regexErrorMessages.hasLowercase)
      .regex(regexPatterns.hasDigit, regexErrorMessages.hasDigit)
      .regex(regexPatterns.hasSymbol, regexErrorMessages.hasSymbol)
      .regex(
        regexPatterns.noSymbolExceptPermittedOnes,
        regexErrorMessages.noSymbolExceptPermittedOnes
      ),
    role: z.enum(["user", "blogger"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const CHECKSTATEBLUEPRINT: {
  [key: string]: { name: keyof typeof regexPatterns; state: boolean }[];
} = {
  username: [
    { name: "noSymbol", state: false },
    { name: "UsernameMinLength", state: false },
  ],
  fullName: [
    { name: "noSymbol", state: false },
    { name: "noDigit", state: false },
    { name: "FullNameMinLength", state: false },
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
  confirmPassword: [
    { name: "hasUppercase", state: false },
    { name: "hasLowercase", state: false },
    { name: "hasDigit", state: false },
    { name: "hasSymbol", state: false },
    { name: "PasswordMinLength", state: false },
    { name: "noSymbolExceptPermittedOnes", state: false }, // @ and _
  ],
};

const FORMDATABLUEPRINT = {
  username: "",
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user",
};

const SignUpForm = ({ styleClasses }: { styleClasses: string }) => {
  const [formState, setFormState] = useState(FORMDATABLUEPRINT);
  const [checks, setChecks] = useState(CHECKSTATEBLUEPRINT);
  const [errorMessages, setErrorMessages] =
    useState<Partial<typeof FORMDATABLUEPRINT>>(FORMDATABLUEPRINT);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formRealtimeChecker = (
    fieldName: keyof typeof FORMDATABLUEPRINT,
    value: string
  ) => {
    const checkers = checks[fieldName];
    checkers.forEach((checker, index) => {
      setChecks((prevState) => {
        const newState = { ...prevState };
        const checkResult = regexPatterns[checker.name].test(value);
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
  const formDataValidator = () => {
    const validationResult = formSchema.safeParse(formState);
    if (validationResult.success) {
      return true;
    } else {
      const formattedErrors = validationResult.error.format();
      setErrorMessages({
        username: formattedErrors.username?._errors[0] || "",
        fullName: formattedErrors.fullName?._errors[0] || "",
        email: formattedErrors.email?._errors[0] || "",
        password: formattedErrors.password?._errors[0] || "",
        confirmPassword: formattedErrors.confirmPassword?._errors[0] || "",
        role: formattedErrors.role?._errors[0] || "",
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
      // ENDPOINT => /api/public/register
      // Login user
      // Redirect to app
      setErrorMessages(FORMDATABLUEPRINT);
      setChecks(CHECKSTATEBLUEPRINT);
    }

    setIsSubmitting(false);
  };
  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name as keyof typeof FORMDATABLUEPRINT]: value,
    }));
    if (name !== "role") {
      formRealtimeChecker(name as keyof typeof FORMDATABLUEPRINT, value);
    }
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
          fieldName="fullName"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={formState.fullName}
          onChangeHandler={onChangeHandler}
          errorMessage={errorMessages?.fullName}
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
        <FormControl
          fieldName="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder=""
          value={formState.confirmPassword}
          onChangeHandler={onChangeHandler}
          errorMessage={errorMessages?.confirmPassword}
        />
        <div className="roleSelectField grid place-items-center">
          <ToggleButtonGroup
            color="primary"
            value={formState.role}
            exclusive
            fullWidth
            onChange={(_e, value) => {
              setFormState((prevState) => ({
                ...prevState,
                role: value,
              }));
            }}
            aria-label="role selection"
          >
            <ToggleButton value="user">User</ToggleButton>
            <ToggleButton value="blogger">Blogger</ToggleButton>
          </ToggleButtonGroup>
        </div>
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
  const id = `signup-${fieldName}`;

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

export default SignUpForm;
