import React from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  className?: string;
}

const variantMap: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white border-transparent hover:bg-blue-700 focus:ring-blue-500",
  secondary:
    "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 focus:ring-gray-300",
  outline:
    "bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-300",
  ghost:
    "bg-transparent text-gray-700 border-transparent hover:bg-gray-100 focus:ring-blue-300",
};

const sizeMap: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...rest
}) => {
  const variantClasses = variantMap[variant];
  const sizeClasses = sizeMap[size];
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
