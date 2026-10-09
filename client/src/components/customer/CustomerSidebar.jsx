import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FileCheck2,
  CalendarDays,
  ReceiptText,
  Star,
  UserCircle,
  LogOut,
  Home,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CustomerSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
    { name: "My Requests", path: "/customer/requests", icon: FileText },
    { name: "Quotations", path: "/customer/quotations", icon: FileCheck2 },
    { name: "Bookings", path: "/customer/bookings", icon: CalendarDays },
    { name: "Invoices", path: "/customer/invoices", icon: ReceiptText },
    { name: "Reviews", path: "/customer/reviews", icon: Star },
    { name: "Profile", path: "/customer/profile", icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ServicePro
        </Link>
        <p className="mt-1 text-xs text-slate-500">Customer Portal</p>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        <Link
          to="/"
          className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Home size={19} />
          <span>Homepage</span>
        </Link>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default CustomerSidebar;
