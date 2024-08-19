import Stripe from "stripe";
import configuredKeys from "../../configs/config";

const stripe = new Stripe(configuredKeys.STRIPE_SECRET_KEY);

type userData = {
  userUsername: string;
  userEmail: string;
};
export const createPayment = async (userData: userData, totalCost: number) => {
  try {
    const user = await stripe.customers.create({
      name: userData.userUsername,
      email: userData.userEmail,
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: user.id,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Guests",
              description: "Table booking",
            },
            unit_amount: Math.round(totalCost * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:4000/success",
      cancel_url: "http://localhost:4000/cancel",
    });
    return session;
  } catch (error) {
    throw new Error(
      `Error creating payment session: ${(error as Error).message}`
    );
  }
};
