import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const switchStyles = cva(
  'inline-flex items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: [
          'bg-gray-300 dark:bg-gray-600', // Inactive state
          'data-[state=checked]:bg-green-500 data-[state=checked]:dark:bg-green-600' // Active state
        ],
        primary: [
          'bg-brand-400 dark:bg-brand-600', // Inactive state (red)
          'data-[state=checked]:bg-brand-500 data-[state=checked]:dark:bg-brand-600' // Active state (blue)
        ],
      },
      size: {
        default: 'h-6 w-11',
        sm: 'h-5 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const thumbStyles = cva(
  'bg-white rounded-full shadow-md transform transition-transform',
  {
    variants: {
      size: {
        default: 'h-5 w-5',
        sm: 'h-4 w-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof switchStyles> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, variant, size, checked, onCheckedChange, ...props }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={switchStyles({ variant, size, className })}
        onClick={() => onCheckedChange(!checked)}
        ref={ref}
        {...props}
      >
        <span
          className={thumbStyles({ size })}
          style={{
            transform: checked ? 'translateX(100%)' : 'translateX(0)',
          }}
        />
      </button>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };