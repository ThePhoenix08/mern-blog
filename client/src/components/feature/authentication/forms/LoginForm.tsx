import { regexErrorMessages, regexPatterns } from "@/data/regex";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FormInputControl } from "../components/Input";
import { CustomButton } from "../components/Button";
import { FaArrowRight, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import login from "@/api/auth/login";
import { setUserCreds } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const FormDataBlueprint: {
  username?: string;
  email?: string;
  password: string;
} = {
  username: "",
  email: "",
  password: "",
};

const loginformSchema = z.object({
  username: z
    .string()
    .min(2, regexErrorMessages.UsernameMinLength)
    .regex(regexPatterns.noSymbol, regexErrorMessages.noSymbol),
  email: z.string().email(regexErrorMessages.validEmail).optional(),
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
    )
    .optional(),
});

const LoginForm = ({ classes }: { classes?: string }) => {
  const [formState, setFormState] = useState(FormDataBlueprint);
  const [formErrors, setFormErrors] = useState(FormDataBlueprint);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserUsingEmailForAuth, setIsUserUsingEmailForAuth] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserUsingEmailForAuth) {
      setFormState((prevState) => {
        delete prevState.username;
        return prevState;
      });
    } else {
      setFormState((prevState) => {
        delete prevState.email;
        return prevState;
      });
    }
  }, [isUserUsingEmailForAuth]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formState);

    setIsSubmitting(true);
    const formData: Record<string, string> = { ...formState };

    const isFormValid = formDataValidator(formData);
    if (!isFormValid) {
      console.log("Form data is invalid");
      toast.error("ValidationError: Please fill all fields correctly");
      setIsSubmitting(false);
      return;
    }

    const response = await login(formData);
    console.log(response);

    if (response.statusCode === 200) {
      toast.success("Login successful");
      dispatch(
        setUserCreds({ user: response.data, isVerified: false, isAuth: true })
      );
      navigate(`/app/profile/${response.data.username}`);
      setFormState(FormDataBlueprint);
      setFormErrors(FormDataBlueprint);
    } else {
      dispatch(setUserCreds({ user: null, isVerified: false, isAuth: false }));
      toast.error("Signup failed");
    }

    setIsSubmitting(false);
  };

  const formDataValidator = (formData: Record<string, string>) => {
    const validationResult = loginformSchema.safeParse(formData);
    if (validationResult.success) {
      return true;
    } else {
      const formattedErrors = validationResult.error.format();
      setFormErrors({
        username: formattedErrors.username?._errors[0] || "",
        email: formattedErrors.email?._errors[0] || "",
        password: formattedErrors.password?._errors[0] || "",
      });

      return false;
    }
  };

  return (
    <div
      className={cn(
        classes,
        "signupform flex flex-col gap-4 shadow-input rounded-xl p-4 lg:p-8"
      )}
    >
      <div className="header flex flex-col">
        <h2 className="text-xl font-bold">Welcome back to Bloggy</h2>
        <p className="text-sm">
          Please fill your credentials to login to your account
        </p>
      </div>
      <form onSubmit={handleSubmit} className="signup-form flex flex-col gap-4">
        <div className="username-email-switch-block flex gap-4">
          <Label>Username</Label>
          <Switch
            checked={isUserUsingEmailForAuth}
            onClick={() => setIsUserUsingEmailForAuth(!isUserUsingEmailForAuth)}
            title="username-email-switch"
            id="username-email-switch"
          />
          <Label>Email</Label>
        </div>
        <div className="username-or-email-block">
          {isUserUsingEmailForAuth ? (
            <FormInputControl
              label="Email"
              id="email"
              type="email"
              helperText={!!formErrors.email ? formErrors.email : ""}
              onChange={handleChange}
            />
          ) : (
            <FormInputControl
              label="Username"
              id="username"
              type="text"
              helperText={!!formErrors.username ? formErrors.username : ""}
              onChange={handleChange}
            />
          )}
        </div>
        <div className="password-block">
          <FormInputControl
            label="Password"
            id="password"
            type="password"
            helperText={formErrors.password}
            onChange={handleChange}
          />
        </div>
        <div className="login-btn-block">
          <CustomButton
            name="Login"
            onClick={() => {}}
            classes="login-btn"
            primary={true}
            icon={
              isSubmitting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaArrowRight />
              )
            }
            iconPosition="right"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
