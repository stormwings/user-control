import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="relative min-h-screen w-full bg-[var(--bg-Color)]">
      <div className="circle" aria-hidden="true"></div>
      <div className="circles" aria-hidden="true"></div>

      <header className="flex items-center justify-between px-8 py-4 shadow-[0_0_20px_rgba(0,0,0,0.3)] bg-white/70 backdrop-blur-sm">
        <a href="/" className="font-bold text-2xl text-black font-f1">
          User<span className="text-brand-primary">Control</span>
        </a>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link
                to="/login"
                className="rounded-full border border-brand-primary px-6 py-2 font-medium text-brand-primary hover:text-brand-hover transition-colors font-f1"
              >
                Ingresar
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div>
        <h1 className="absolute left-4 top-[30%] text-[72px] md:text-[100px] leading-none text-brand-text font-f4">
          User <span className="text-brand-primary">Control</span>
        </h1>

        <p className="absolute left-4 top-[48%] max-w-[800px] text-[20px] md:text-[24px] leading-8 text-brand-text font-f2">
          - Cuentas para sucursal. <br />
        </p>
      </div>
    </section>
  );
};

export default Home;
