import { Link, useNavigate } from "react-router-dom";
import { FaBox, FaUserCircle, FaSignInAlt, FaUsers } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout, reset } from "../../features/auth/authSlice";
import { LAYOUT_TEST_IDS, NAV_TEST_IDS } from "../../constants/testIds";

const Item = ({ to, icon: Icon, label, testId }) => (
  <Link
    to={to}
    data-cy={testId}
    className="
      group flex flex-col items-center md:flex-row md:gap-3
      rounded-2xl px-3 py-3 mx-2 my-1
      text-gray-400 hover:text-white hover:bg-[var(--blackpos-primary)] hover:bg-brand-hover
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
    <div
      className="flex h-full flex-col justify-between"
      data-cy={LAYOUT_TEST_IDS.SIDEBAR}
    >
      <nav
        className="mt-2 flex flex-col"
        data-cy={LAYOUT_TEST_IDS.SIDEBAR_NAV}
      >
        <Item to="/dashboard" icon={FaBox} label="Panel" testId={NAV_TEST_IDS.NAV_DASHBOARD} />
        <Item to="/dashboard/users" icon={FaUsers} label="Usuarios" testId={NAV_TEST_IDS.NAV_USERS} />
      </nav>

      <div className="mb-2 flex flex-col items-center md:items-stretch">
        <div
          className="mx-2 mb-2 flex items-center justify-center gap-2 rounded-2xl border border-gray-600 px-3 py-2 md:justify-start transition-colors"
          data-cy={LAYOUT_TEST_IDS.SIDEBAR_USER_MENU}
        >
          <FaUserCircle className="text-2xl text-emerald-400" />
          <span className="hidden md:block text-emerald-300 font-medium truncate max-w-[10rem]">
            {user?.name}
          </span>
        </div>

        <button
          onClick={logoutUser}
          data-cy={LAYOUT_TEST_IDS.SIDEBAR_LOGOUT_BUTTON}
          className="
            mx-2 mt-2 flex items-center justify-center gap-2 rounded-2xl
            border border-red-800 px-3 py-2 text-red-400 hover:bg-red-900/20
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
