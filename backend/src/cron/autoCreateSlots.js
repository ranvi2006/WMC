const axios = require("axios");
const getNextDates = require("../utils/getNextDates");

const createSlots = async () => {
  try {
    await axios.post(
      "https://your-backend.onrender.com/api/availability/auto-create",
      {
        dates: getNextDates(2), // next 2 days
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_JWT}`,
        },
      }
    );

    console.log("Slots auto-created");

  } catch (err) {
    console.error("Auto slot creation failed");
  }
};

module.exports = createSlots;
