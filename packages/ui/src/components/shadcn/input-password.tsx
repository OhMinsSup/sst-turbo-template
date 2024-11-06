import type { LucideProps } from "lucide-react";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";

export type InputPasswordProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & { iconEyeProps?: LucideProps; iconEyeOffProps?: LucideProps };

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ className, iconEyeOffProps, iconEyeProps, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <div className="relative rounded-md">
        <Input
          type={showPassword ? "text" : "password"}
          className={className}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 size-6 -translate-y-1/2 rounded-md text-muted-foreground"
          onClick={() => {
            setShowPassword((prev) => !prev);
          }}
        >
          {showPassword ? (
            <Eye {...iconEyeProps} />
          ) : (
            <EyeOff {...iconEyeOffProps} />
          )}
        </Button>
      </div>
    );
  },
);

InputPassword.displayName = "InputPassword";

export { InputPassword };
