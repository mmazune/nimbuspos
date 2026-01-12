import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-nimbus-blue text-white hover:bg-nimbus-blue/90 shadow-sm',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-nimbus-navy/20 bg-background hover:bg-nimbus-mist hover:text-nimbus-navy',
        secondary: 'border border-nimbus-navy/10 bg-white text-nimbus-navy hover:bg-nimbus-mist/50',
        ghost: 'hover:bg-nimbus-mist hover:text-nimbus-navy',
        link: 'text-nimbus-blue underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-4 py-2', // 44px min height
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-12 rounded-xl px-8',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
