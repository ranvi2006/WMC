const getNextDates = (days) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};

module.exports = getNextDates;
