import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { AUTH_TEST_IDS } from "../constants/testIds";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { email, password } = form;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error, success, message, isLoading } = useSelector(
    (s) => s.auth
  );

  useEffect(() => {
    if (error) toast.error(message);
    if (success || user) navigate("/dashboard");

    dispatch(reset());
  }, [error, success, user, message, navigate, dispatch]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error || 'Error al iniciar sesión');
    }
  };

  return (
    <div
      className="
        min-h-screen w-full flex items-center justify-center p-4
        bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900
      "
      data-cy={AUTH_TEST_IDS.LOGIN_PAGE}
      data-testid="login-page"
    >
      <form
        onSubmit={handleSubmit}
        aria-label="Formulario de ingreso"
        className="w-[400px] max-w-full rounded-xl bg-gray-800 p-12 pt-12 shadow-card transition-colors"
        data-cy={AUTH_TEST_IDS.LOGIN_FORM}
      >
        <h1 className="mb-6 text-center text-2xl font-f1 text-gray-200">
          User <span className="text-brand-hover">Control</span>
        </h1>

        <div className="mb-3 flex flex-col">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-brand-hover"
          >
            Correo
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="tu@email.com"
            value={email}
            onChange={onChange}
            autoComplete="username"
            required
            data-cy={AUTH_TEST_IDS.LOGIN_EMAIL_INPUT}
            className="
              mt-2 rounded-lg border border-gray-600
              bg-gray-700 px-3 py-3
              text-gray-100
              placeholder:text-gray-500
              outline-none transition-colors
              focus:border-brand-hover
              focus:bg-gray-600
              focus:ring-4 focus:ring-[rgba(64,153,175,0.15)]
            "
          />
        </div>

        <div className="mb-4 flex flex-col">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-brand-hover"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={onChange}
            autoComplete="current-password"
            required
            data-cy={AUTH_TEST_IDS.LOGIN_PASSWORD_INPUT}
            className="
              mt-2 rounded-lg border border-gray-600
              bg-gray-700 px-3 py-3
              text-gray-100
              placeholder:text-gray-500
              outline-none transition-colors
              focus:border-brand-hover
              focus:bg-gray-600
              focus:ring-4 focus:ring-[rgba(64,153,175,0.15)]
            "
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          data-cy={AUTH_TEST_IDS.LOGIN_SUBMIT_BUTTON}
          className="
            w-full rounded-full bg-brand-hover px-4 py-3 font-bold text-white
            shadow-btn transition active:translate-y-[1px]
            hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70
          "
        >
          {isLoading ? "Ingresando..." : "Ingresar"}
        </button>

        <div className="mt-4 text-center">
          <a
            href="/"
            data-cy={AUTH_TEST_IDS.LOGIN_BACK_HOME_LINK}
            className="font-medium text-brand-hover hover:text-opacity-80"
          >
            Volver al inicio
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
