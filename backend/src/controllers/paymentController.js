const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createPayment = async (req, res) => {
  try {
    // 1️⃣ Create Razorpay order (₹9 = 900 paise)
    const order = await razorpay.orders.create({
      amount: 900,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // 2️⃣ Save payment in DB
    const payment = await Payment.create({
      userId: req.user.id,
      amount: 9,
      currency: "INR",
      status: "created",
      provider: "razorpay",
      providerOrderId: order.id,
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      paymentId: payment._id,
      amount: 900,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    paymentId,
  } = req.body;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    await Payment.findByIdAndUpdate(paymentId, {
      status: "success",
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};