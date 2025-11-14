import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";

const ThemeToggleButton = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex items-center justify-center rounded-full p-2
        border border-gray-200 dark:border-gray-600
        bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
        text-gray-700 dark:text-gray-200
        hover:bg-white dark:hover:bg-gray-800
        transition-all
        ${className}
      `}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {isDark ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
    </button>
  );
};

export default ThemeToggleButton;
