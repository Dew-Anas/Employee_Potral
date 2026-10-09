const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",

    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400",

    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",

    outline:
      "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-400",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;