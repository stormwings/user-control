import { Link } from "react-router-dom";

import { NAV_TEST_IDS } from "../constants/testIds";

const Home = () => {
  return (
    <section className="relative min-h-screen w-full bg-[var(--bg-Color)]" data-cy="home-page">
      <div className="circle" aria-hidden="true"></div>
      <div className="circles" aria-hidden="true"></div>

      <header className="flex items-center justify-between px-8 py-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-gray-800/70 backdrop-blur-sm transition-colors">
        <a href="/" className="font-bold text-2xl text-gray-100 font-f1" data-cy="home-logo">
          User<span className="text-brand-hover">Control</span>
        </a>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <Link
                to="/login"
                className="rounded-full border border-brand-hover px-6 py-2 font-medium text-brand-hover hover:text-opacity-80 transition-colors font-f1"
                data-cy={NAV_TEST_IDS.NAV_HOME}
              >
                Ingresar
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </section>
  );
};

export default Home;
