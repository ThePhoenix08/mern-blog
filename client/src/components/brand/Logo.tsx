import { cn } from "@/utils/classMerge.util";
import React from "react";
import { PiTextBFill } from "react-icons/pi";

const Logo = ({ classes, state }: { classes?: string; state: boolean }) => {
  return (
    <div
      className={cn(
        "flex justify-start p-4 gap-2 items-center w-full",
        classes
      )}
    >
      {!state && (
        <>
          <span className="sm:text-lg md:text-2xl lg:text-4xl text-blue-marguerite-500">
            Bloggy
          </span>
          <span className="sm:text-lg md:text-2xl lg:text-4xl text-zinc-600">
            |
          </span>
        </>
      )}
      <PiTextBFill className="sm:text-2xl md:text-4xl lg:text-6xl text-tomato-500" />
    </div>
  );
};

export default Logo;
