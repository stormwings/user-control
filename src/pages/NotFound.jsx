import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-Color)] p-6">
      <div className="rounded-xl border border-gray-200 bg-[#f2f2f2] px-12 py-8 text-center shadow-sm">
        <h1 className="text-4xl font-bold text-brand-primary mb-4">404</h1>
        <p className="text-xl font-medium text-red-500 mb-6">
          Página no encontrada
        </p>
        <Link
          to="/"
          className="rounded-full border border-brand-primary px-6 py-2 font-medium text-brand-primary hover:text-brand-hover transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
