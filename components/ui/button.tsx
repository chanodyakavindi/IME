import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-navy text-white hover:bg-navy-soft",
        secondary: "border border-line bg-white text-navy hover:bg-canvas",
        teal: "bg-verified text-white hover:bg-teal-800",
        ghost: "text-navy hover:bg-canvas",
        danger: "bg-red-700 text-white hover:bg-red-800",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function buttonClass(
  variant: VariantProps<typeof buttonVariants>["variant"] = "primary",
  size: VariantProps<typeof buttonVariants>["size"] = "md",
  className?: string,
) {
  return cn(buttonVariants({ variant, size }), className);
}
