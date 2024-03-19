import * as React from 'react';
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

export type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <div className="relative rounded-md">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={className}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-muted-foreground absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md"
          onClick={() => {
            setShowPassword((prev) => !prev);
          }}
        >
          {showPassword ? <EyeOpenIcon /> : <EyeNoneIcon />}
        </Button>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
