import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-pill shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-pill",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-pill",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-pill",
        ghost: "hover:bg-muted hover:text-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "gradient-primary text-primary-foreground rounded-pill shadow-lg hover:shadow-glow hover:scale-105 active:scale-100",
        accent: "gradient-accent text-accent-foreground rounded-pill shadow-md hover:shadow-lg hover:scale-105",
        glass: "glass text-foreground hover:bg-card/90 rounded-pill",
        success: "bg-success text-success-foreground hover:bg-success/90 rounded-pill shadow-sm",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
