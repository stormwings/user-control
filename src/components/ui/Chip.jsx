const chipTones = {
  gray: "bg-gray-700 text-gray-300",
  green: "bg-green-900/30 text-green-400",
  blue: "bg-blue-900/30 text-blue-400",
  amber: "bg-amber-900/30 text-amber-400",
  red: "bg-red-900/30 text-red-400",
};

export const Chip = ({ children, tone = "gray", dataCy }) => {
  const toneClasses = chipTones[tone] || chipTones.gray;

  return (
    <span
      data-cy={dataCy}
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${toneClasses}`}
    >
      {children}
    </span>
  );
};
