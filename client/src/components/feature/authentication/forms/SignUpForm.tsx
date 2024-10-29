import { cn } from "@/lib/utils";
import { FormInputControl } from "../components/Input";
import { CustomButton } from "../components/Button";
import { FaArrowRight, FaSpinner } from "react-icons/fa";
import { regexPatterns, regexErrorMessages } from "@/data/regex";
import { z } from "zod";
import toast from "react-hot-toast";
import { useState } from "react";
import register from "@/api/auth/register";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserCreds } from "@/redux/slices/authSlice";

const FormDataBlueprint = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const signupformSchema = z.object({
  username: z
    .string()
    .min(2, regexErrorMessages.UsernameMinLength)
    .regex(regexPatterns.noSymbol, regexErrorMessages.noSymbol),
  email: z.string().email(regexErrorMessages.validEmail),
  firstName: z
    .string()
    .min(2, regexErrorMessages.NameMinLength)
    .regex(/^[a-zA-Z\s]*$/, "No symbols or digits allowed in full name"),
  lastName: z
    .string()
    .min(2, regexErrorMessages.NameMinLength)
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
  role: z.enum(["user", "blogger"]),
});

const SignUpForm = ({ classes }: { classes?: string }) => {
  const [formState, setFormState] = useState(FormDataBlueprint);
  const [formErrors, setFormErrors] = useState(FormDataBlueprint);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    formData["role"] = "user";

    const isFormValid = formDataValidator(formData);
    if (!isFormValid) {
      console.log("Form data is invalid");
      toast.error("ValidationError: Please fill all fields correctly");
      setIsSubmitting(false);
      return;
    }
    formData["fullname"] = `${formState.firstName} ${formState.lastName}`;
    delete formData["firstName"];
    delete formData["lastName"];

    const response = await register(formData);
    console.log(response);

    if (response.statusCode === 200) {
      toast.success("Signup successful");
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
    const validationResult = signupformSchema.safeParse(formData);
    if (validationResult.success) {
      return true;
    } else {
      const formattedErrors = validationResult.error.format();
      setFormErrors({
        username: formattedErrors.username?._errors[0] || "",
        firstName: formattedErrors.firstName?._errors[0] || "",
        lastName: formattedErrors.lastName?._errors[0] || "",
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
        <h2 className="text-xl font-bold">Welcome to Bloggy</h2>
        <p className="text-sm">
          Please fill your details below to create an account
        </p>
      </div>
      <form onSubmit={handleSubmit} className="signup-form flex flex-col gap-4">
        <div className="username-block">
          <FormInputControl
            label="Username"
            id="username"
            helperText={formErrors.username}
            onChange={handleChange}
          />
        </div>
        <div className="name-block grid grid-cols-2 gap-4">
          <div className="first-name-block">
            <FormInputControl
              label="First Name"
              id="firstName"
              helperText={formErrors.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="last-name-block">
            <FormInputControl
              label="Last Name"
              id="lastName"
              helperText={formErrors.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="email-block">
          <FormInputControl
            label="Email"
            id="email"
            type="email"
            helperText={formErrors.email}
            onChange={handleChange}
          />
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
        <div className="signup-btn-block">
          <CustomButton
            name="Sign Up"
            onClick={() => {}}
            classes="signup-btn"
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

export default SignUpForm;
