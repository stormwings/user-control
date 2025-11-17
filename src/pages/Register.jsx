import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { register as registerAction, reset } from "../features/auth/authSlice";
// import ThemeToggleButton from "../components/theme/ThemeToggleButton";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { name, email, password } = form;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error, message, isLoading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (error) toast.error(message);
    if (success) navigate("/login");

    dispatch(reset());
  }, [error, success, message, navigate, dispatch]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(registerAction({ name, email, password })).unwrap();
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error || 'Error al registrar usuario');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-Color)] flex items-start md:items-center justify-center p-4 pt-10">
      {/* <ThemeToggleButton className="fixed top-4 right-4" /> */}
      <form
        onSubmit={handleSubmit}
        data-cy="register-form"
        className="w-[400px] max-w-full rounded-xl bg-white dark:bg-gray-800 p-12 pt-12 shadow-[0_12px_32px_rgba(0,0,0,.12)] dark:shadow-[0_12px_32px_rgba(0,0,0,.4)] transition-colors"
        aria-label="Formulario de registro"
      >
        <h1 className="mb-6 text-center text-2xl font-f1 text-brand-text dark:text-gray-200">
          Crear cuenta
        </h1>

        <div className="mb-3 flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-semibold text-brand-primary dark:text-brand-hover"
          >
            Nombre
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Tu nombre"
            value={name}
            onChange={onChange}
            required
            data-cy="register-input-name"
            className="mt-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-[#f6f6f6] dark:bg-gray-700 px-3 py-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-colors focus:border-brand-primary dark:focus:border-brand-hover focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-[rgba(60,71,135,0.15)] dark:focus:ring-[rgba(64,153,175,0.15)]"
          />
        </div>

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
            data-cy="register-input-email"
            className="mt-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-[#f6f6f6] dark:bg-gray-700 px-3 py-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-colors focus:border-brand-primary dark:focus:border-brand-hover focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-[rgba(60,71,135,0.15)] dark:focus:ring-[rgba(64,153,175,0.15)]"
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
            autoComplete="new-password"
            required
            minLength={6}
            data-cy="register-input-password"
            className="mt-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-[#f6f6f6] dark:bg-gray-700 px-3 py-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-colors focus:border-brand-primary dark:focus:border-brand-hover focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-[rgba(60,71,135,0.15)] dark:focus:ring-[rgba(64,153,175,0.15)]"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          data-cy="register-submit-button"
          className="w-full rounded-full bg-brand-primary dark:bg-brand-hover px-4 py-3 font-bold text-white shadow-[0_6px_16px_rgba(60,71,135,.25)] dark:shadow-[0_6px_16px_rgba(64,153,175,.25)] transition active:translate-y-[1px] hover:bg-brand-hover dark:hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Creando..." : "Registrarse"}
        </button>

        <div className="mt-4 text-center">
          <Link
            to="/"
            data-cy="register-back-home-link"
            className="font-medium text-brand-primary dark:text-brand-hover hover:text-brand-hover dark:hover:text-opacity-80"
          >
            Volver al inicio
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
