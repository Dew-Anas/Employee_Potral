// server/scripts/seedChecklist.js
// WHY: Postman test- test and creat 

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const ChecklistItem = require("../src/models/ChecklistItem");
const { createItemsFromTemplate } = require("../src/controllers/checklistController");

const CATEGORY_ID = "6acf055b5f060d04553aff9c"; // "Cleaning"
const TEST_EMAIL = "test.employee@servicepro.test";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  try {
    if (process.argv[2] === "clean") {
      const del = await ChecklistItem.deleteMany({ booking: process.argv[3] });
      console.log("deleted:", del.deletedCount);
      return;
    }
    const user = await User.findOne({ email: TEST_EMAIL });
    if (!user) throw new Error("Test employee not found");
    const bookingId = new mongoose.Types.ObjectId();

    const items = await createItemsFromTemplate(bookingId, user._id, CATEGORY_ID);

    console.log("bookingId:", bookingId.toString());
    console.log("items created:", items.length);
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});