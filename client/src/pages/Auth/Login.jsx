// Employee sign-in page. Calls AuthContext.login -> POST /auth/login.
// Backend messages (e.g. "waiting for admin approval") are shown as-is.

import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "../../components/auth/AuthShell";
import { TextField, PasswordField } from "../../components/auth/AuthFields";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Cannot reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your employee portal.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="you@example.com"
        />

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="pt-1 text-center text-sm text-muted">
          New employee?{" "}
          <Link to="/register" className="font-semibold text-primary hover:text-primary/80">
            Register as Employee
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export default Login;