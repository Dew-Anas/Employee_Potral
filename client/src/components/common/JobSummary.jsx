
import { LuClock, LuPlay, LuCheck } from "react-icons/lu";


const CARDS = [
  { key: "pending", label: "Pending", icon: LuClock, color: "text-muted" },
  { key: "inProgress", label: "In Progress", icon: LuPlay, color: "text-primary" },
  { key: "completed", label: "Completed", icon: LuCheck, color: "text-teal" },
];

function JobSummary({ jobs = [] }) {
  
  const counts = {
    pending: jobs.filter((j) => j.status === "Assigned" || j.status === "Pending").length,
    inProgress: jobs.filter((j) => j.status === "In Progress").length,
    completed: jobs.filter((j) => j.status === "Completed").length,
  };

  const total = jobs.length;
  
  const percent = total === 0 ? 0 : Math.round((counts.completed / total) * 100);

  return (
    <section>
     
      <div className="grid grid-cols-3 gap-3">
        {CARDS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="rounded-2xl border border-line bg-surface p-3">
            <Icon className={`text-lg ${color}`} />
            
            <p className="mt-2 font-mono text-2xl font-semibold text-ink">{counts[key]}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>

      
      <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            {counts.completed} of {total} jobs completed
          </span>
          <span className="font-mono text-ink">{percent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full bg-teal transition-all"
            style={{ width: `${percent}%` }} // % 
          />
        </div>
      </div>
    </section>
  );
}

export default JobSummary;