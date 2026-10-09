import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Briefcase, UserRound } from "lucide-react";
import Button from "../../components/ui/Button";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../utils/roles";

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [searchParams] = useSearchParams();
  const initialPortal =
    searchParams.get("portal") === "employee" ? "employee" : "customer";

  const [portal, setPortal] = useState(initialPortal);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        ...formData,
        expectedRole: portal,
      });

      localStorage.setItem("token", data.token);
      login(data.user);
      navigate(getDashboardPath(data.user.role));
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome to ServicePro
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Choose your portal, then sign in
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setPortal("customer");
              setError("");
            }}
            className={`rounded-xl border px-4 py-3 text-left transition ${
              portal === "customer"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <UserRound size={18} />
            <p className="mt-2 text-sm font-semibold">Customer</p>
            <p className="mt-1 text-xs opacity-80">Requests and bookings</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setPortal("employee");
              setError("");
            }}
            className={`rounded-xl border px-4 py-3 text-left transition ${
              portal === "employee"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Briefcase size={18} />
            <p className="mt-2 text-sm font-semibold">Employee</p>
            <p className="mt-1 text-xs opacity-80">Assigned field jobs</p>
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={
                portal === "employee"
                  ? "Enter your employee email"
                  : "Enter your customer email"
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Signing in..."
              : portal === "employee"
                ? "Sign in as Employee"
                : "Sign in as Customer"}
          </Button>
        </form>

        {portal === "customer" ? (
          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Create customer account
            </Link>
          </p>
        ) : (
          <p className="mt-6 text-center text-sm text-slate-500">
            Employee accounts are created by an administrator.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
