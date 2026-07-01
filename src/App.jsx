import { useState } from "react";
import { Link, NavLink, Outlet, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import QuestionList from "./pages/QuestionList";
import QuestionDetail from "./pages/QuestionDetail";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Questions", to: "/questions" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const linkClass = ({ isActive }) =>
    `text-sm transition-colors ${
      isActive
        ? "font-semibold text-gray-900 dark:text-gray-100"
        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur dark:border-gray-800 dark:bg-gray-950/85">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight"
          onClick={close}
        >
          DIUQBank
        </Link>

        <button
          className="flex flex-col gap-1.5 p-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="h-0.5 w-6 rounded bg-current" />
          <span className="h-0.5 w-6 rounded bg-current" />
          <span className="h-0.5 w-6 rounded bg-current" />
        </button>

        {/* desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/questions"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Browse Questions
          </Link>
        </nav>
      </div>

      {/* mobile menu */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              onClick={close}
              className={linkClass}
            >
              <span className="block py-2">{link.label}</span>
            </NavLink>
          ))}
          <Link
            to="/questions"
            onClick={close}
            className="mt-2 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            Browse Questions
          </Link>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:text-left">
        <span className="font-bold">DIUQBank</span>
        <nav className="flex flex-wrap gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} DIUQBank. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<QuestionList />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
      </Route>
    </Routes>
  );
}
