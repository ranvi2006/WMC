const Payment = require("../models/Payment");

exports.createPayment = async (req, res) => {
  try {
    // console.log("Creating payment for user:", req.user.id);
    const payment = await Payment.create({
      userId: req.user.id,
      amount: 9,
      status: "success"
    });

    res.status(201).json({
      success: true,
      paymentId: payment._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
