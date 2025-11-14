import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import ThemeToggleButton from "../components/ThemeToggleButton";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div
      className="
        min-h-screen w-full flex items-center justify-center p-4
        bg-gradient-to-tr from-brand-primary via-[#5462b0] to-brand-hover
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      "
      data-testid="login-page"
    >
      <ThemeToggleButton className="fixed top-4 right-4" />
      <form
        onSubmit={handleSubmit}
        aria-label="Formulario de ingreso"
        className="w-[400px] max-w-full rounded-xl bg-white dark:bg-gray-800 p-12 pt-12 shadow-card transition-colors"
      >
        <h1 className="mb-6 text-center text-2xl font-f1 text-brand-text dark:text-gray-200">
          User <span className="text-brand-primary dark:text-brand-hover">Control</span>
        </h1>

        <div className="mb-3 flex flex-col">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-brand-primary dark:text-brand-hover"
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
            className="
              mt-2 rounded-lg border border-gray-200 dark:border-gray-600
              bg-[#f6f6f6] dark:bg-gray-700 px-3 py-3
              text-gray-900 dark:text-gray-100
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              outline-none transition-colors
              focus:border-brand-primary dark:focus:border-brand-hover
              focus:bg-white dark:focus:bg-gray-600
              focus:ring-4 focus:ring-[rgba(60,71,135,0.15)] dark:focus:ring-[rgba(64,153,175,0.15)]
            "
          />
        </div>

        <div className="mb-4 flex flex-col">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-brand-primary dark:text-brand-hover"
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
            className="
              mt-2 rounded-lg border border-gray-200 dark:border-gray-600
              bg-[#f6f6f6] dark:bg-gray-700 px-3 py-3
              text-gray-900 dark:text-gray-100
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              outline-none transition-colors
              focus:border-brand-primary dark:focus:border-brand-hover
              focus:bg-white dark:focus:bg-gray-600
              focus:ring-4 focus:ring-[rgba(60,71,135,0.15)] dark:focus:ring-[rgba(64,153,175,0.15)]
            "
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full rounded-full bg-brand-primary dark:bg-brand-hover px-4 py-3 font-bold text-white
            shadow-btn transition active:translate-y-[1px]
            hover:bg-brand-hover dark:hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70
          "
        >
          {isLoading ? "Ingresando..." : "Ingresar"}
        </button>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="font-medium text-brand-primary dark:text-brand-hover hover:text-brand-hover dark:hover:text-opacity-80"
          >
            Volver al inicio
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
