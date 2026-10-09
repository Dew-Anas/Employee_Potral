import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../utils/roles";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ServicePro
        </Link>

        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Home
          </Link>
          <Link
            to="/services"
            className="text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Services
          </Link>

          {user ? (
            <>
              <Link
                to={getDashboardPath(user.role)}
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Customer Login
              </Link>
              <Link
                to="/login?portal=employee"
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Employee Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
