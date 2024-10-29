import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";

import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const radius = 100;
    const [visible, setVisible] = useState(false);

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }
    return (
      <motion.div
        style={{
          background: useMotionTemplate`
          radial-gradient(
            ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
            var(--blue-500),
            transparent 80%
          )
        `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="p-[2px] rounded-lg transition duration-300 group/input"
      >
        <input
          type={type}
          className={cn(
            `flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
            file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
            focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
             disabled:cursor-not-allowed disabled:opacity-50
             dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
             group-hover/input:shadow-none transition duration-400
             `,
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);
Input.displayName = "Input";

const FormInputControl = ({
  label,
  id,
  helperText,
  type = "text",
  onChange,
}: {
  label: string;
  id: string;
  helperText: string;
  type?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element => {
  const isError = helperText != "";

  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{label}</label>
      <Input
        name={id}
        type={type}
        id={id}
        placeholder={label}
        onChange={onChange}
      />
      {helperText && (
        <p
          className={cn(
            "text-xs md:text-sm",
            isError ? "text-red-500" : "text-neutral-700"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export { Input, FormInputControl };