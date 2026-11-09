
//cteate a temporery data to check createItemsFromTemplate tru db 

// finalli delete this site

require("dotenv").config();

const mongoose = require("mongoose");
const ChecklistItem = require("../src/models/ChecklistItem");

const {
  createItemsFromTemplate,
} = require("../src/controllers/checklistController");

const CATEGORY_ID = "6acf055b5f060d04553aff9c"; // Cleaning category

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected successfully");

  const bookingId = new mongoose.Types.ObjectId();
  const employeeId = new mongoose.Types.ObjectId();

  try {
    // First call: Create 5 checklist items
    const first = await createItemsFromTemplate(
      bookingId,
      employeeId,
      CATEGORY_ID
    );

    // Second call: Existing items should be returned
    const second = await createItemsFromTemplate(
      bookingId,
      employeeId,
      CATEGORY_ID
    );

    console.log("first call:", first.length, "items");
    console.log("second call:", second.length, "items ( items 5)");

    console.log(
      "in DB:",
      await ChecklistItem.countDocuments({ booking: bookingId })
    );

  } finally {
    // Delete only this test booking's checklist items
    await ChecklistItem.deleteMany({ booking: bookingId });

    console.log("cleaned up");

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  }
}

run().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});


