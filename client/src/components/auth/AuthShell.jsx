// Shared layout for the public auth pages (Login, Register).
// Desktop: brand panel on the left + form on the right. Mobile: compact logo + form.
// Used by: pages/Auth/Login.jsx, pages/Auth/Register.jsx

import { Link } from "react-router-dom";
import { LuClipboardList, LuClock, LuCamera } from "react-icons/lu";
import { useTheme } from "../../context/ThemeContext";

const points = [
  {
    icon: LuClipboardList,
    title: "Your assignments, in one place",
    text: "See new jobs from admin, accept them and follow every step.",
  },
  {
    icon: LuClock,
    title: "Simple attendance",
    text: "Clock in and out whenever you start or finish work.",
  },
  {
    icon: LuCamera,
    title: "Proof of every job",
    text: "Add before, during and after photos with your notes.",
  },
];

function AuthShell({ title, subtitle, children, wide = false }) {
  const themeCtx = useTheme();
  const theme = themeCtx?.theme ?? "dark";

  const logo =
    theme === "dark"
      ? "/images/servicepro-logo-dark.png"
      : "/images/servicepro-logo-light.png";

  return (
    <div className="min-h-screen bg-page text-ink lg:grid lg:grid-cols-[minmax(360px,5fr)_7fr]">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden overflow-hidden border-r border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" />

        <img src={logo} alt="ServicePro" className="relative h-9 w-auto max-w-[180px] object-contain object-left" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Employee portal
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-tight">
            Field work, organised from start to finish.
          </h2>

          <ul className="mt-10 space-y-6">
            {points.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{p.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative text-xs text-muted">© {new Date().getFullYear()} ServicePro</p>
      </aside>

      {/* Form side */}
      <main className="flex min-h-screen flex-col px-4 py-6 sm:px-8 lg:px-14 lg:py-12">
        <Link to="/login" aria-label="ServicePro" className="mb-6 inline-flex lg:hidden">
          <img src={logo} alt="ServicePro" className="h-7 w-auto max-w-[130px] object-contain object-left" />
        </Link>

        <div className={`mx-auto my-auto w-full ${wide ? "max-w-2xl" : "max-w-md"}`}>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default AuthShell;