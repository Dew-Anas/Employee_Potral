
// client/src/services/jobService.js
// WHY: Single place where the app gets jobs.
// Pages never care if data is demo or real.
//
// SWITCH:
// true  -> Demo jobs (UI testing only)
// false -> Real jobs from Admin assignments
//
// TEMP-DB: Demo data is temporary.

import api from "./api";

export const USING_DEMO_DATA = false;

// ---------- Demo data (TEMP-DB) ----------

const DEMO_EMPLOYEE_SKILLS = ["AC"];

const demoJobs = [
  {
    id: "demo-1",
    serviceName: "AC Repair",
    requiredSkills: ["AC"],
    customerName: "Customer A",
    customerPhone: "077 000 0000",
    address: "Sample Address, Colombo",
    scheduledAt: "2026-11-02T09:00:00",
    status: "Completed",
    requestedTasks: [
      "Inspect the air conditioning unit",
      "Check the cooling performance",
      "Clean the AC filters",
    ],
    additionalRequirements:
      "Please check for unusual noise and report any problems.",
  },
  {
    id: "demo-2",
    serviceName: "AC Gas Refill",
    requiredSkills: ["AC"],
    customerName: "Customer B",
    customerPhone: "077 000 0001",
    address: "Sample Address, Dehiwala",
    scheduledAt: "2026-11-02T13:30:00",
    status: "Assigned",
    requestedTasks: [
      "Inspect the AC gas level",
      "Check for gas leakage",
      "Refill AC gas if required",
    ],
    additionalRequirements:
      "Inform the customer before carrying out additional repairs.",
  },
  {
    id: "demo-3",
    serviceName: "Home Maintenance",
    requiredSkills: ["Home Maintenance"],
    customerName: "Customer C",
    customerPhone: "077 000 0002",
    address: "Sample Address, Mount Lavinia",
    scheduledAt: "2026-11-03T10:00:00",
    status: "Assigned",
    requestedTasks: [
      "Inspect the requested maintenance area",
      "Identify maintenance issues",
    ],
    additionalRequirements: "",
  },
];

function matchesSkills(job) {
  return job.requiredSkills.every((skill) =>
    DEMO_EMPLOYEE_SKILLS.includes(skill)
  );
}

// ---------- Public functions ----------

// Get all jobs assigned to the logged-in employee.
export async function getMyJobs() {
  if (USING_DEMO_DATA) {
    return demoJobs.filter(matchesSkills);
  }

  const res = await api.get("/employee/jobs");
  return res.data.jobs || [];
}

// Get one job. Returns null when the job does not exist.
export async function getJobById(id) {
  if (USING_DEMO_DATA) {
    const jobs = await getMyJobs();
    return jobs.find((job) => job.id === id) || null;
  }

  try {
    const res = await api.get(`/employee/jobs/${id}`);
    return res.data.job || null;
  } catch (error) {
    // 400 and 404 mean the requested job was not found.
    if (
      error.response?.status === 404 ||
      error.response?.status === 400
    ) {
      return null;
    }

    throw error;
  }
}

// Start work: Assigned -> In Progress.
// Backend validates attendance, photos and active jobs.
export async function startJob(id) {
  const res = await api.put(`/employee/jobs/${id}/start`);
  return res.data;
}

// Complete work: In Progress -> Completed.
// Backend checks the Completion Gate.
export async function completeJob(id) {
  const res = await api.put(`/employee/jobs/${id}/complete`);
  return res.data;
}
