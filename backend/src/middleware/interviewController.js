const Interview = require("../models/InterviewBooking");

exports.bookInterview = async (req, res) => {
  const booking = await Interview.create({
    studentId: req.user._id,
    resumeUrl: req.file.path,
    ...req.body
  });
  res.json(booking);
};
