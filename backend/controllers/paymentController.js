import Stripe from "stripe";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!["pro", "enterprise"].includes(plan)) {
      return res.status(400).json({
        message: "Invalid plan selected",
      });
    }

    const priceData =
      plan === "pro"
        ? {
            currency: "usd",
            product_data: {
              name: "ResumeAI Pro Plan",
              description: "20 resume analyses per month",
            },
            unit_amount: 1900,
            recurring: {
              interval: "month",
            },
          }
        : {
            currency: "usd",
            product_data: {
              name: "ResumeAI Enterprise Plan",
              description: "Unlimited resume analyses",
            },
            unit_amount: 7900,
            recurring: {
              interval: "month",
            },
          };

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "https://ai-resume-analyzer-main-alpha.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}/payment-success?plan=${plan}`,
      cancel_url: `${frontendUrl}/payment-cancel`,
      metadata: {
        userId: req.user._id.toString(),
        plan,
      },
    });

    res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUserPlan = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!["free", "pro", "enterprise"].includes(plan)) {
      return res.status(400).json({
        message: "Invalid plan",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        plan,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      message: "Plan updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};