export const Card = ({ children, className = "" }) => (
  <section className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-colors ${className}`}>
    {children}
  </section>
);

export const CardHeader = ({ title, subtitle }) => (
  <div className="mb-3">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
      {title}
    </h3>
    {subtitle && (
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {subtitle}
      </p>
    )}
  </div>
);
