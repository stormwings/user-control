export const Card = ({ children, className = "", dataCy }) => (
  <section
    data-cy={dataCy}
    className={`rounded-xl border border-gray-700 bg-gray-800 p-4 transition-colors ${className}`}
  >
    {children}
  </section>
);

export const CardHeader = ({ title, subtitle, dataCy }) => (
  <div className="mb-3" data-cy={dataCy}>
    <h3 className="text-sm font-semibold text-gray-200">
      {title}
    </h3>
    {subtitle && (
      <p className="mt-1 text-xs text-gray-400">
        {subtitle}
      </p>
    )}
  </div>
);
