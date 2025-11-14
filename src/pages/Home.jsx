import { Link } from "react-router-dom";
import ThemeToggleButton from "../components/ThemeToggleButton";

const Home = () => {
  return (
    <section className="relative min-h-screen w-full bg-[var(--bg-Color)]">
      <div className="circle" aria-hidden="true"></div>
      <div className="circles" aria-hidden="true"></div>

      <header className="flex items-center justify-between px-8 py-4 shadow-[0_0_20px_rgba(0,0,0,0.3)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-colors">
        <a href="/" className="font-bold text-2xl text-black dark:text-gray-100 font-f1">
          User<span className="text-brand-primary dark:text-brand-hover">Control</span>
        </a>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <ThemeToggleButton />
            </li>
            <li>
              <Link
                to="/login"
                className="rounded-full border border-brand-primary dark:border-brand-hover px-6 py-2 font-medium text-brand-primary dark:text-brand-hover hover:text-brand-hover dark:hover:text-opacity-80 transition-colors font-f1"
              >
                Ingresar
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div>
        <h1 className="absolute left-4 top-[30%] text-[72px] md:text-[100px] leading-none text-brand-text dark:text-gray-200 font-f4">
          User <span className="text-brand-primary dark:text-brand-hover">Control</span>
        </h1>

        <p className="absolute left-4 top-[48%] max-w-[800px] text-[20px] md:text-[24px] leading-8 text-brand-text dark:text-gray-300 font-f2">
          - Cuentas para sucursal. <br />
        </p>
      </div>
    </section>
  );
};

export default Home;
