import { Link, useNavigate } from "react-router-dom";
import { FaBox, FaUserCircle, FaSignInAlt, FaUsers } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout, reset } from "../../features/auth/authSlice";

const Item = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="
      group flex flex-col items-center md:flex-row md:gap-3
      rounded-2xl px-3 py-3 mx-2 my-1
      text-gray-500 dark:text-gray-400 hover:text-white hover:bg-[var(--blackpos-primary)] dark:hover:bg-brand-hover
      transition-colors
    "
  >
    <Icon className="text-2xl" />
    <span className="mt-1 text-sm md:mt-0 md:text-base md:font-medium hidden md:block">
      {label}
    </span>
  </Link>
);

const SidebarLeft = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutUser = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(reset());
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error || 'Error al cerrar sesión');
      dispatch(reset());
      navigate("/");
    }
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <nav className="mt-2 flex flex-col">
        <Item to="/dashboard" icon={FaBox} label="Panel" />
        <Item to="/dashboard/users" icon={FaUsers} label="Usuarios" />
      </nav>

      <div className="mb-2 flex flex-col items-center md:items-stretch">
        <div className="mx-2 mb-2 flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-600 px-3 py-2 md:justify-start transition-colors">
          <FaUserCircle className="text-2xl text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:block text-emerald-700 dark:text-emerald-300 font-medium truncate max-w-[10rem]">
            {user?.name}
          </span>
        </div>

        {/* <ThemeToggle /> */}

        <button
          onClick={logoutUser}
          className="
            mx-2 mt-2 flex items-center justify-center gap-2 rounded-2xl
            border border-red-200 dark:border-red-800 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
            transition-colors
          "
          title="Cerrar sesión"
        >
          <FaSignInAlt className="text-xl" />
          <span className="hidden md:block font-medium">Salir</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarLeft;
