
import { NavLink } from "react-router-dom";

import {
  LuLayoutDashboard,
  LuClipboardList,
  LuClock,
  LuUserRound
} from "react-icons/lu";

function EmployeeNavigation() {
  const navigationItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: LuLayoutDashboard,
      end: true
    },
    {
      label: "Assignments",
      path: "/assignments",
      icon: LuClipboardList
    },
    {
      label: "Attendance",
      path: "/attendance",
      icon: LuClock
    },
    {
      label: "Profile",
      path: "/profile",
      icon: LuUserRound
    }
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 px-3 pb-safe pt-2 backdrop-blur-xl">

      <div className="mx-auto flex max-w-lg items-center justify-around">

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-elevated hover:text-ink"
                }`
              }
            >
              <Icon size={21} strokeWidth={1.8} />

              <span className="text-[10px] font-semibold">
                {item.label}
              </span>

            </NavLink>
          );
        })}

      </div>

    </nav>
  );
}

export default EmployeeNavigation;
