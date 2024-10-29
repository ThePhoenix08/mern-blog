import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

type ButtonVariants =
  | "secondary"
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "ghost"
  | null
  | undefined;

export const CustomButton = ({
  name,
  onClick,
  classes,
  type = "button",
  primary = false,
  icon = undefined,
  iconPosition = "left",
  disabled = false,
}: {
  name: string;
  onClick: any;
  type?: "button" | "submit" | "reset";
  classes?: string;
  primary?: boolean;
  icon?: JSX.Element;
  iconPosition?: "left" | "right";
  disabled?: boolean;
}) => {
  const BtnVariant = (primary ? "default" : "secondary") as ButtonVariants;
  const BtnValueElement = <span className="">{name}</span>;
  const IconElement = <span className="">{icon}</span>;

  return (
    <div className="signup-btn-block">
      <Button
        className={cn(
          "w-full rounded-md h-10 font-medium relative group/btn",
          !primary &&
            "bg-gradient-to-br text-white from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",
          classes
        )}
        onClick={onClick}
        variant={BtnVariant}
        type={type}
        disabled={disabled}
      >
        <div className="flex items-center justify-center gap-4">
          {iconPosition === "left" ? (
            <>
              {IconElement}
              {BtnValueElement}
            </>
          ) : (
            <>
              {BtnValueElement}
              {IconElement}
            </>
          )}
        </div>
        <BottomGradient />
      </Button>
    </div>
  );
};
