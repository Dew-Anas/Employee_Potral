import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import SopTaskList from "../../components/employee/SopTaskList";
import AttendanceCard from "../../components/employee/AttendanceCard";
import ChecklistProgress from "../../components/employee/ChecklistProgress";
import JobEvidence from "../../components/employee/JobEvidence";
// import { Link } from "react-router-dom";

const JobDetails = () => {
  const { jobId } = useParams();

  const job = {
    id: jobId,
    service: "Home Maintenance",
    customer: "Customer One",
    phone: "+94 77 123 4567",
    date: "2026-10-02",
    time: "10:00",
    address: "Jaffna",
    description:
      "General home maintenance and repair service.",
    status: "confirmed",
  };

  const [tasks, setTasks] = useState([
    {
        id: "TASK-001",
        title: "Inspect service area",
        description:
        "Check the service area before starting the work.",
        required: true,
        completed: false,
    },
    {
        id: "TASK-002",
        title: "Identify required materials",
        description:
        "Verify the materials and tools required for the service.",
        required: true,
        completed: false,
    },
    {
        id: "TASK-003",
        title: "Perform maintenance work",
        description:
        "Complete the assigned maintenance work according to the SOP.",
        required: true,
        completed: false,
    },
    {
        id: "TASK-004",
        title: "Clean the work area",
        description:
        "Clean and organize the service area after completing the work.",
        required: false,
        completed: false,
    },
    ]);

    const handleToggleTask = (taskId) => {
    setTasks((previousTasks) =>
        previousTasks.map((task) =>
        task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
            }
            : task
        )
    );
    };

    const requiredTasks = tasks.filter(
    (task) => task.required
    );

    const completedRequiredTasks = requiredTasks.filter(
    (task) => task.completed
    );

    const allRequiredTasksCompleted =
    requiredTasks.length === completedRequiredTasks.length;

    const checklistPercentage =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter((task) => task.completed).length /
            tasks.length) *
            100
        );

  return (
    <div>
      <Link
        to="/employee/jobs"
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to Jobs
      </Link>

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Job Details
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {job.id}
        </p>
      </div>

      {/* Service */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Service Information
        </h2>

        <div className="mt-4">
          <p className="text-sm text-slate-500">
            Service
          </p>

          <p className="mt-1 font-medium text-slate-800">
            {job.service}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-slate-500">
            Description
          </p>

          <p className="mt-1 text-slate-700">
            {job.description}
          </p>
        </div>
      </div>

      {/* Customer */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Customer Information
        </h2>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-700">
            <span className="font-medium">
              Customer:
            </span>{" "}
            {job.customer}
          </p>

          <p className="text-sm text-slate-700">
            <span className="font-medium">
              Phone:
            </span>{" "}
            {job.phone}
          </p>

          <p className="text-sm text-slate-700">
            <span className="font-medium">
              Address:
            </span>{" "}
            {job.address}
          </p>
        </div>
      </div>

      {/* Schedule */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Schedule
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">
              Date
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {job.date}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Time
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {job.time}
            </p>
          </div>
        </div>
      </div>

      {/* SOP Tasks */}
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
        <h2 className="text-lg font-semibold text-slate-900">
            Service Tasks
        </h2>

        <p className="mt-1 text-sm text-slate-500">
            Complete all required tasks before finishing the service.
        </p>
        </div>

        <span className="text-sm font-medium text-slate-600">
        {completedRequiredTasks.length} / {requiredTasks.length} required
        </span>
    </div>

    <div className="mt-5">
        <SopTaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        />
    </div>
    </div>

    <div className="mt-6">
      <AttendanceCard bookingId={job.id} />
    </div>


      {/* Start Service */}
      <div className="mt-6">
        {allRequiredTasksCompleted ? (
        <Link
            to={`/employee/jobs/${job.id}/start`}
            className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
        >
            Start Service
        </Link>
        ) : (
        <div className="rounded-lg bg-slate-100 px-5 py-3 text-center text-sm font-medium text-slate-500">
            Complete all required tasks to continue
        </div>
        )}
      </div>

      {/* Service Checklist */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Service Checklist
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete the service tasks according to the SOP.
            </p>
          </div>

          <span className="text-sm font-medium text-slate-600">
            {completedRequiredTasks.length} /{" "}
            {requiredTasks.length} required
          </span>
        </div>

        <div className="mt-5">
          <ChecklistProgress tasks={tasks} />
        </div>

        <SopTaskList
          tasks={tasks}
          onToggle={handleToggleTask}
        />
      </div>

      <JobEvidence />

      {job.status === "in_progress" && allRequiredTasksCompleted && (
        <div className="mt-6">
          <Link
            to={`/employee/jobs/${job.id}/complete`}
            className="block w-full rounded-lg bg-green-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-green-700"
          >
            Complete Service
          </Link>
        </div>
      )}

    </div>
  );
};

export default JobDetails;