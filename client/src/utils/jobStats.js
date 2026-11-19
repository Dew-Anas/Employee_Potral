// client/src/utils/jobStats.js
// WHY: ONE place that decides how jobs are grouped and counted.
//      Assignments page and Dashboard both use these functions, so their numbers always match.
// RULES (lead + employee decision):
//   - Pending  = booking status Assigned AND the employee has NOT declined it.
//   - Declined = the job stays visible in "All" with a Declined badge for DECLINED_VISIBLE_DAYS,
//                but it is never counted as Pending / never counted in the Dashboard.
//   - Bell     = Assigned and no answer yet (a declined job is already answered).
// TODO(confirm): lead said the visible period is flexible; 15 days chosen. Change ONE number below.

export const DECLINED_VISIBLE_DAYS = 15;

const DAY_MS = 24 * 60 * 60 * 1000;

export const isDeclined = (job) => job.response === "Declined";

// Which tab a job belongs to.
export const groupOf = (job) => {
  if (isDeclined(job)) return "declined";
  if (job.status === "In Progress") return "inProgress";
  if (job.status === "Completed") return "completed";
  return "pending"; // portal "Pending" = booking "Assigned"
};

// New assignment = Assigned by admin and the employee has not answered yet.
export const isNewAssignment = (job) =>
  (job.status === "Assigned" || job.status === "Pending") && !job.response;

// A declined job older than DECLINED_VISIBLE_DAYS is hidden from the list.
// If the server did not send a date, keep it visible (safe default).
export const isDeclinedExpired = (job, now = Date.now()) => {
  if (!isDeclined(job) || !job.respondedAt) return false;

  const answeredAt = new Date(job.respondedAt).getTime();
  if (Number.isNaN(answeredAt)) return false;

  return now - answeredAt > DECLINED_VISIBLE_DAYS * DAY_MS;
};

// Jobs shown in the "All" list: expired declined jobs removed, declined ones placed last.
export const getListJobs = (jobs) => {
  const listed = jobs.filter((job) => !isDeclinedExpired(job));
  const active = listed.filter((job) => !isDeclined(job));
  const declined = listed.filter(isDeclined);
  return [...active, ...declined];
};

// Jobs that count in numbers and progress bars (declined jobs are not my work).
export const getCountableJobs = (jobs) => jobs.filter((job) => !isDeclined(job));

// Numbers for the tabs.
export const getCounts = (listJobs) => ({
  all: listJobs.length,
  pending: listJobs.filter((job) => groupOf(job) === "pending").length,
  inProgress: listJobs.filter((job) => groupOf(job) === "inProgress").length,
  completed: listJobs.filter((job) => groupOf(job) === "completed").length,
});