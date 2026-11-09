
// temperary file adter testing i can remove this file



require("dotenv").config();

const mongoose = require("mongoose");
const ChecklistTemplate = require("../src/models/ChecklistTemplate");

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    // Read all checklist templates from shared database
    const templates = await ChecklistTemplate.find().lean();

    console.log(
      JSON.stringify(templates, null, 2)
    );

    console.log(`\nTotal Templates: ${templates.length}`);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
}

run().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
