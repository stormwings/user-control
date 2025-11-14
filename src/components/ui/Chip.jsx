const chipTones = {
  gray: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
  green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export const Chip = ({ children, tone = "gray" }) => {
  const toneClasses = chipTones[tone] || chipTones.gray;

  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${toneClasses}`}>
      {children}
    </span>
  );
};
