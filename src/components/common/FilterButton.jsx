export const FilterButton = ({
  children,
  active,
  onClick,
  title,
  icon: Icon,
  dataCy,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    data-cy={dataCy}
    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
      active
        ? "bg-[var(--blackpos-primary)] text-white"
        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
    }`}
  >
    {Icon && <Icon className="mr-1 inline-block" />}
    {children}
  </button>
);
