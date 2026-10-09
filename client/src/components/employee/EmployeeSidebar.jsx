import { Link, useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, Home, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const EmployeeSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const links = [
    { name: "Dashboard", path: "/employee/dashboard", icon: LayoutDashboard },
    { name: "My Jobs", path: "/employee/jobs", icon: ClipboardList },
    { name: "Profile", path: "/employee/profile", icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white md:block">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link to="/" className="text-xl font-bold text-blue-600">
          ServicePro
        </Link>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Home size={20} />
            <span>Homepage</span>
          </Link>
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default EmployeeSidebar;
