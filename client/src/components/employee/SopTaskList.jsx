import {
  CheckCircle2,
  Circle,
} from "lucide-react";

const SopTaskList = ({ tasks, onToggle }) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`rounded-xl border p-4 transition ${
            task.completed
              ? "border-green-200 bg-green-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => onToggle(task.id)}
              className="mt-0.5 shrink-0"
              aria-label={
                task.completed
                  ? "Mark task as incomplete"
                  : "Mark task as complete"
              }
            >
              {task.completed ? (
                <CheckCircle2
                  size={22}
                  className="text-green-600"
                />
              ) : (
                <Circle
                  size={22}
                  className="text-slate-400"
                />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={`font-medium ${
                    task.completed
                      ? "text-green-700 line-through"
                      : "text-slate-800"
                  }`}
                >
                  {task.title}
                </p>

                {task.required && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                    Required
                  </span>
                )}
              </div>

              {task.description && (
                <p className="mt-1 text-sm text-slate-500">
                  {task.description}
                </p>
              )}

              <p
                className={`mt-2 text-xs font-medium ${
                  task.completed
                    ? "text-green-600"
                    : "text-slate-500"
                }`}
              >
                {task.completed
                  ? "Completed"
                  : "Pending"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SopTaskList;