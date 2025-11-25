export const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  dataCy,
  ...props
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    data-cy={dataCy}
    className={`w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none transition-colors focus:border-brand-hover ${className}`}
    {...props}
  />
);
