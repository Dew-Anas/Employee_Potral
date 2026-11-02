// TEMPORARY DEMO DATA - not real bookings or real employee skills.
// Replace with real API calls once the bookings API and skill field are confirmed.
export const USING_DEMO_DATA = true;

const DEMO_EMPLOYEE_SKILLS = ["AC"];

const demoJobs = [
  {
    id: "demo-1",
    serviceName: "AC Repair",
    requiredSkills: ["AC"],
    customerName: " Customer A",
    customerPhone: "077 000 0000",
    address: "Sample Address, Colombo",
    scheduledAt: "2026-11-02T09:00:00",
    status: "Completed",
  },
  {
    id: "demo-2",
    serviceName: "AC Gas Refill",
    requiredSkills: ["AC"],
    customerName: " Customer B",
    customerPhone: "077 000 0001",
    address: "Sample Address, Dehiwala",
    scheduledAt: "2026-11-02T13:30:00",
    status: "Assigned",
  },
  {
    id: "demo-3",
    serviceName: "Home Maintenance",
    requiredSkills: ["Home Maintenance"],
    customerName: " Customer C",
    customerPhone: "077 000 0002",
    address: "Sample Address, Mount Lavinia",
    scheduledAt: "2026-11-03T10:00:00",
    status: "Assigned",
  },
];

function matchesSkills(job) {
  return job.requiredSkills.every((skill) =>
    DEMO_EMPLOYEE_SKILLS.includes(skill)
  );
}

export async function getMyJobs() {
  return demoJobs.filter(matchesSkills);
}
export async function getJobById(id){
  const jobs = await getMyJobs();
  return jobs.find((job) => job.id===id) || null;
}