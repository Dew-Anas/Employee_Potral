const ChecklistProgress = ({ tasks = [] }) => {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const percentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const requiredTasks = tasks.filter(
    (task) => task.required
  );

  const completedRequiredTasks = requiredTasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="mb-5 rounded-xl bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Checklist Progress
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>

        <span className="text-lg font-bold text-blue-600">
          {percentage}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Required tasks: {completedRequiredTasks} /{" "}
        {requiredTasks.length}
      </p>
    </div>
  );
};

export default ChecklistProgress;