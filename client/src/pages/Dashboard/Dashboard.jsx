
import { Link,useNavigate } from "react-router-dom";
import JobSummary from "../../components/common/JobSummary";
import AttendanceStatus from "../../components/common/AttendanceStatus";
import { useTheme } from "../../context/ThemeContext";


import {
  LuBriefcaseBusiness,
  LuBell,
  LuClipboardList,
  LuClock3,
  LuArrowUpRight,
  LuUserRound,
  LuArrowRight,
  LuSun,
  LuMoon ,
  LuCircleCheck
} from "react-icons/lu";

function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen bg-page px-4 pb-28 pt-5 text-ink sm:px-6 sm:pt-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Application Header */}
        <header className="flex items-center justify-between border-b border-line pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <LuBriefcaseBusiness size={22} />
            </div>

            <div>
              <h1 className="font-heading text-xl font-bold tracking-tight">
                ServicePro
              </h1>
              <p className="mt-0.5 text-xs text-muted">
                Employee Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Field Operations</p>
              <p className="mt-0.5 text-xs text-muted">
                Employee Workspace
              </p>
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-primary/50 hover:text-primary"
            >
              <LuBell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-surface" />
            </button>

            <div 
            onClick={() => navigate("/profile")}
            
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-elevated text-primary">
              <LuUserRound size={20} />
            </div>
          </div>
        </header>

        {/* Page Heading */}
        <section className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] font-medium tracking-[0.2em] text-primary">
              FIELD OPERATIONS / OVERVIEW
            </p>

            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Work Dashboard
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Manage your assigned services and daily activities.
            </p>
            
          </div>

         

          <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="sticky top-4 z-40 flex w-fit items-center gap-3 rounded-xl border border-line bg-surface/95 px-4 py-3 text-sm font-semibold text-ink shadow-lg backdrop-blur-xl transition hover:border-primary/50"
      >
        {theme === "dark" ? (
          <LuSun size={21} className="text-primary" />
        ) : (
          <LuMoon size={21} className="text-primary" />
        )}

        <span>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      </button>

          
        </section>

        {/* Dashboard Content */}
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.65fr_1fr]">

          {/* Assigned Services */}
          <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-black/10">

                    {/* Job summary cards + shortcut to the full list. TEMP-DB: data comes from jobService demo data. */}
        <div className="mt-8 ">
          <JobSummary />
          
        </div>
            

            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/5">
                <LuClipboardList size={29} strokeWidth={1.7} />
              </div>

             

              

              <Link
                to="/assignments"
                className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 hover:shadow-primary/30"
              >
                View Assignments
                <LuArrowRight size={17} />
              </Link>
            </div>
          </section>

          {/* Operations Panel */}
          <div className="flex flex-col gap-5">

            {/* Attendance */}
            <section className="rounded-2xl border border-line bg-surface p-5 shadow-xl shadow-black/10 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal/20 bg-teal/10 text-teal">
                  <LuClock3 size={22} />
                </div>

                <span className="rounded-full border border-line bg-elevated px-3 py-1 text-[10px] font-semibold tracking-wide text-muted">
                  ATTENDANCE
                </span>
              </div>

              <h3 className="mt-5 font-heading text-xl font-bold">
                Attendance
              </h3>

             <AttendanceStatus />

              <Link
                to="/attendance"
                className="mt-5 flex w-full items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/15"
              >
                Open Attendance
                <LuArrowUpRight size={18} />
              </Link>
            </section>

            {/* Quick Access */}
            <section className="rounded-2xl border border-line bg-surface p-5 shadow-xl shadow-black/10 sm:p-6">
              <p className="font-mono text-[10px] tracking-[0.18em] text-primary">
                QUICK ACCESS
              </p>

              <h3 className="mt-2 font-heading text-lg font-bold">
                Employee Tools
              </h3>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/assignments"
                  className="group flex items-center justify-between rounded-xl border border-line bg-elevated/50 px-4 py-3 transition hover:border-primary/40 hover:bg-elevated"
                >
                  <div className="flex items-center gap-3">
                    <LuClipboardList
                      size={18}
                      className="text-primary"
                    />
                    <span className="text-sm font-medium">
                      My Assignments
                    </span>
                  </div>

                  <LuArrowUpRight
                    size={16}
                    className="text-muted transition group-hover:text-primary"
                  />
                </Link>

                <Link
                  to="/profile"
                  className="group flex items-center justify-between rounded-xl border border-line bg-elevated/50 px-4 py-3 transition hover:border-primary/40 hover:bg-elevated"
                >
                  <div className="flex items-center gap-3">
                    <LuUserRound
                      size={18}
                      className="text-primary"
                    />
                    <span className="text-sm font-medium">
                      My Profile
                    </span>
                  </div>

                  <LuArrowUpRight
                    size={16}
                    className="text-muted transition group-hover:text-primary"
                  />
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 flex items-center justify-center gap-2 border-t border-line py-5 text-xs text-muted">
          <LuCircleCheck size={14} className="text-teal" />
          ServicePro Employee Workspace
        </footer>

      </div>
    </main>
  );
}

export default Dashboard;
