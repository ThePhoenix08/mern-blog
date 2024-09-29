import React, { useState } from "react";
import { cn } from "@/utils/classMerge.util";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import Button from "@mui/material/Button/Button";
import { z } from "zod";
import { regexErrorMessages } from "./common";
import TextField from "@mui/material/TextField/TextField";
import { useNavigate } from "react-router-dom";

const FORMDATABLUEPRINT = {
  email: "",
};

const formSchema = z.object({
  email: z.string().email(regexErrorMessages.validEmail),
});

const EmailForm = ({ styleClasses }: { styleClasses?: string }) => {
  const [formState, setFormState] = useState(FORMDATABLUEPRINT);
  const [errorMessages, setErrorMessages] =
    useState<Partial<typeof FORMDATABLUEPRINT>>(FORMDATABLUEPRINT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formDataValidator = (): boolean => {
    const validationResult = formSchema.safeParse(formState);
    if (validationResult.success) {
      return true;
    } else {
      const formattedErrors = validationResult.error.format();
      setErrorMessages({
        email: formattedErrors.email?._errors[0] || "",
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
      // ENDPOINT => /api/public/forgotPassword/email
      // send entered email ID to server
      // send email on entered email ID for password reset
      setErrorMessages(FORMDATABLUEPRINT);
      // NAVIGATE TO => /forgot-Password/resetCode
      navigate("/forgot-Password/resetCode");
    }

    setIsSubmitting(false);
  };
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name as keyof typeof FORMDATABLUEPRINT]: value,
    }));
  };
  const onResetHandler = () => {
    setFormState(FORMDATABLUEPRINT);
    setErrorMessages(FORMDATABLUEPRINT);
    setIsSubmitting(false);
  };

  return (
    <div className={cn("flex-container flex flex-col gap-4", styleClasses)}>
      <div className="heading-text flex flex-col gap-2">
        <p className="text-center text-3xl font-bold">Forgot Password ?</p>
        <p className="text-center text-sm text-zinc-700">
          No worries, we will send you reset instructions.
        </p>
      </div>
      <form
        onSubmit={onSubmitHandler}
        onReset={onResetHandler}
        className="form flex flex-col gap-4"
      >
        <div className="form-control">
          <TextField
            id="forgotPassword-email"
            name="email"
            label="Email Address"
            type="text"
            placeholder="johndoe@gmail.com"
            value={formState.email}
            onChange={onChangeHandler}
            required={true}
            className={`form-input ${errorMessages?.email ? "input-error" : ""}`}
            helperText={errorMessages?.email || ""}
            error={!!errorMessages?.email}
            color="primary"
            fullWidth
          />
        </div>
        <div className="flex gap-4 justify-around">
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            type="submit"
            size="large"
          >
            Send Code
          </LoadingButton>
          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={() => navigate("/login")}
            disabled={isSubmitting}
          >
            Back to log in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;
