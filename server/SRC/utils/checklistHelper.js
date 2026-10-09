import ChecklistItem from "../models/ChecklistItem.js";

const DEFAULT_ITEMS = [
  {
    title: "Inspect service area",
    description: "Check the service area before starting the work.",
    isRequired: true,
  },
  {
    title: "Complete assigned work",
    description: "Perform the service according to the booking requirements.",
    isRequired: true,
  },
  {
    title: "Clean the work area",
    description: "Leave the site clean after completing the service.",
    isRequired: true,
  },
  {
    title: "Capture job photos",
    description: "Upload at least one photo as evidence of the completed work.",
    isRequired: true,
  },
];

export const ensureDefaultChecklist = async (bookingId) => {
  const existingCount = await ChecklistItem.countDocuments({
    booking: bookingId,
  });

  if (existingCount > 0) {
    return;
  }

  await ChecklistItem.insertMany(
    DEFAULT_ITEMS.map((item) => ({
      ...item,
      booking: bookingId,
    }))
  );
};
