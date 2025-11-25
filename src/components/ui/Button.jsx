const buttonVariants = {
  ghost: "border border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-200",
  primary: "bg-[var(--blackpos-primary)] hover:bg-brand-hover text-white",
  secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600",
};

const buttonSizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  title,
  className = "",
  type = "button",
  dataCy,
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const variantClasses = buttonVariants[variant] || buttonVariants.primary;
  const sizeClasses = buttonSizes[size] || buttonSizes.md;

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      title={title}
      disabled={disabled}
      data-cy={dataCy}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  );
};
