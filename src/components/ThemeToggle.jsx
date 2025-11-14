import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        mx-2 flex items-center justify-center gap-2 rounded-2xl
        border border-gray-200 dark:border-gray-600 px-3 py-2
        text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors
      "
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {isDark ? (
        <>
          <FiSun className="text-xl" />
          <span className="hidden md:block font-medium">Claro</span>
        </>
      ) : (
        <>
          <FiMoon className="text-xl" />
          <span className="hidden md:block font-medium">Oscuro</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
