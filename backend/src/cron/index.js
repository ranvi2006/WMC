const cron = require("node-cron");
const createSlots = require("./autoCreateSlots");

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily slot creation...");
  await createSlots();
});