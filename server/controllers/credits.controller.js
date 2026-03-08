const userModel = require("../models/user.model");

const CREDIT_MAPPING = { "Starter": 80, "Popular": 180, "Pro Learner": 430 };
const PRICE_MAPPING = { "Starter": 100, "Popular": 180, "Pro Learner": 500 };

exports.createCreditsOrder = async (req, res) => {
  try {
    // ✅ YAHAN DEFINE KARO: stripe ko require aur initialize dono ek sath
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const { planName } = req.body;
    const userId = req.userId;

    const credits = CREDIT_MAPPING[planName];
    const price = PRICE_MAPPING[planName];

    if (!credits) return res.status(400).json({ success: false, message: "Invalid Plan" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: { name: `${planName} Credits` },
          unit_amount: price * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/credits/success`,
      cancel_url: `${process.env.CLIENT_URL}/credits/cancel`,
      metadata: { userId: userId.toString(), creditsToAdd: credits.toString() },
    });

    res.json({ success: true, session });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.stripeWebhook = async (req, res) => {
  // ✅ Yahan bhi define karna zaroori hai
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await userModel.findByIdAndUpdate(session.metadata.userId, {
      $inc: { credits: parseInt(session.metadata.creditsToAdd) },
    });
  }
  res.json({ received: true });
};