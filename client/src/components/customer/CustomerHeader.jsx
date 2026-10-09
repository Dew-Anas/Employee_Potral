import { Link } from "react-router-dom";
import { Home, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CustomerHeader = () => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Customer Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Manage your services and requests
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Home size={16} />
          Homepage
        </Link>
        <UserCircle size={32} className="text-slate-500" />
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-slate-800">
            {user ? `${user.firstName} ${user.lastName}` : "Customer"}
          </p>
          <p className="text-xs text-slate-500">{user?.email || "Account"}</p>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
