import { useState } from "react";
import { ArrowUpRight, Menu, Moon, Sprout, Sun, X } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";
import { useTheme } from "./themeContext";
import { logOut } from "../features/auth/api/auth.api";
import { toAppError } from "../shared/errors/appError";
import { Notice, primaryClass } from "../shared/ui/Elements";

const nav = [
  { to: "/donations", label: "Explore donations" },
  { to: "/organizations", label: "Organizations" },
  { to: "/about", label: "How it works" },
];

function Brand() {
  return (
    <Link
      to="/"
      className="inline-flex shrink-0 items-center gap-3"
      aria-label="FoodBridge home"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-forest-700 text-white dark:bg-forest-500 dark:text-forest-950">
        <Sprout size={22} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="text-xl font-bold tracking-tight text-forest-950 dark:text-stone-50">
        food<span className="font-normal">bridge</span>
      </span>
    </Link>
  );
}

export default function AppLayout() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLogoutError("");
    try {
      await logOut();
      setMenuOpen(false);
    } catch (cause) {
      setLogoutError(toAppError(cause).message);
    }
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors hover:text-forest-700 dark:hover:text-forest-100 ${isActive ? "text-forest-700 dark:text-forest-100" : "text-stone-600 dark:text-stone-300"}`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-stone-50/95 backdrop-blur dark:border-stone-800 dark:bg-forest-950/95">
        <div className="flex w-full items-center justify-between gap-6 px-4 py-3 sm:px-8 lg:px-12 2xl:px-20">
          <Brand />
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 xl:flex xl:gap-10"
          >
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-5 xl:flex">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              className="rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>
            {user ? (
              <>
                <Link to="/dashboard" className={navClass({ isActive: false })}>
                  Dashboard
                </Link>
                <Link to="/profile" className={navClass({ isActive: false })}>
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="text-sm font-semibold text-stone-600 hover:text-forest-700 dark:text-stone-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className={navClass({ isActive: false })}>
                Log in
              </Link>
            )}
            <Link
              to={user ? "/donations/new" : "/signup"}
              className={primaryClass}
            >
              {user ? "Post a donation" : "Join the community"}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              className="rounded-full p-2.5 text-stone-700 dark:text-stone-200"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="rounded-full border border-stone-300 p-2.5 text-forest-800 dark:border-stone-700 dark:text-stone-100"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            className="border-t border-stone-200 bg-stone-50 px-4 pb-5 pt-3 dark:border-stone-800 dark:bg-forest-950 sm:px-8 xl:hidden"
          >
            <div className="flex flex-col gap-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-semibold text-stone-700 hover:bg-forest-50 dark:text-stone-100 dark:hover:bg-forest-900"
                >
                  {item.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-semibold text-stone-700 dark:text-stone-100"
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-semibold text-stone-700 dark:text-stone-100"
                  >
                    My profile
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="rounded-lg px-3 py-3 text-left text-base font-semibold text-stone-700 dark:text-stone-100"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-semibold text-stone-700 dark:text-stone-100"
                >
                  Log in
                </NavLink>
              )}
            </div>
            <Link
              to={user ? "/donations/new" : "/signup"}
              onClick={() => setMenuOpen(false)}
              className={`${primaryClass} mt-3 w-full`}
            >
              {user ? "Post a donation" : "Join the community"}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </nav>
        )}
        {logoutError && (
          <div className="px-4 pb-3 sm:px-8">
            <Notice error>{logoutError}</Notice>
          </div>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-forest-950">
        <div className="grid gap-8 px-4 py-10 sm:px-8 md:grid-cols-2 lg:px-12 2xl:px-20">
          <div>
            <Brand />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              A place for good food and useful supplies to find their way to
              people who need them.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-stone-600 dark:text-stone-300 md:justify-end">
            <Link to="/donations" className="hover:text-forest-700">
              Explore donations
            </Link>
            <Link to="/organizations" className="hover:text-forest-700">
              Organizations
            </Link>
            <Link to="/about" className="hover:text-forest-700">
              How it works
            </Link>
          </div>
        </div>
        <div className="border-t border-stone-200 px-4 py-5 text-xs text-stone-500 dark:border-stone-800 sm:px-8 lg:px-12 2xl:px-20">
          © {new Date().getFullYear()} FoodBridge. Made for communities that
          share.
        </div>
      </footer>
    </div>
  );
}
