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
    "rounded-xl bg-[#10183e] px-8 py-4 font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-[1.03]",
  secondary:
    "rounded-xl bg-[#e8e8ea] px-8 py-4 font-semibold text-[#0d153b] transition-all duration-300 hover:scale-[1.03] hover:bg-[#e2e2e4]",
  outline:
    "bg-transparent text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-300",
  ghost:
    "bg-transparent text-gray-800 border-transparent hover:bg-gray-50 focus:ring-gray-300",
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
