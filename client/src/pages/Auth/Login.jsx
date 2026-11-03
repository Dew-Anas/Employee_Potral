
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6"
      >
        <h1 className="font-heading text-2xl font-semibold text-ink">ServicePro</h1>
        <p className="mt-1 text-sm text-muted">Sign in to your employee portal</p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <label className="mt-5 block text-sm text-muted">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2.5 text-ink outline-none focus:border-primary"
        />

        <label className="mt-4 block text-sm text-muted">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2.5 text-ink outline-none focus:border-primary"
        />

         <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-xl bg-primary py-2.5 font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default Login;