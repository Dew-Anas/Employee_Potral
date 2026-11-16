
import { NavLink } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuClipboardList,
  LuClock,
  LuUserRound,
} from "react-icons/lu";
import { useTheme } from "../../context/ThemeContext";

function EmployeeNavigation() {
  const { theme } = useTheme();

  const logo =
    theme === "dark"
      ? "/images/servicepro-logo-dark.png"
      : "/images/servicepro-logo-light.png";

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: LuLayoutDashboard,
      end: true,
    },
    {
      label: "Assignments",
      path: "/assignments",
      icon: LuClipboardList,
    },
    {
      label: "Attendance",
      path: "/attendance",
      icon: LuClock,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: LuUserRound,
    },
  ];

  const navLinkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-3 text-sm transition-colors ${
      isActive
        ? "bg-primary/10 font-semibold text-primary"
        : "text-muted hover:bg-elevated hover:text-ink"
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-20 items-center border-b border-line px-6">
          <img
            src={logo}
            alt="ServicePro"
            className="h-11 w-auto max-w-[190px] object-contain"
          />
        </div>

        <div className="flex-1 px-4 py-8">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
            Workspace
          </p>

          <nav aria-label="Employee navigation" className="flex flex-col gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={navLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-line px-6 py-5">
          <p className="text-xs font-semibold text-ink">
            ServicePro Employee
          </p>
          <p className="mt-1 text-[11px] text-muted">
            Field Operations Workspace
          </p>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Employee navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 lg:hidden"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex min-w-0 flex-1 flex-col items-center gap-1 py-2 ${
                    isActive ? "text-primary" : "text-muted"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={21}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                    <span
                      className={`text-[10px] ${
                        isActive ? "font-bold" : "font-medium"
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default EmployeeNavigation;
