export const QuickAction = ({ icon: Icon, label, className = "", onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-3 text-xs shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}
  >
    <Icon className="text-gray-600 dark:text-gray-400" />
    <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
  </button>
);
