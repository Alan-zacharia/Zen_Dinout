import Stripe from "stripe";
import configuredKeys from "../../configs/envConfig";

const stripe = new Stripe(configuredKeys.STRIPE_SECRET_KEY);

type userData = {
  username: string;
  email: string;
};
const createMembershipPaymentIntent = async (userData: userData, membershipCost: number) => {
  try {
    const user = await stripe.customers.create({
      name: userData.username,
      email: userData.email,
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: user.id,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Membership plan",
              description: "Membership purchase",
            },
            unit_amount: Math.round(membershipCost * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${configuredKeys.CLIENT_URL}/membership-success?status=true`,
      cancel_url: `${configuredKeys.CLIENT_URL}/membership-cancel?status=false`,
    });
    return session;
  } catch (error) {
    throw new Error(
      `Error creating payment session: ${(error as Error).message}`
    );
  }
};

export default createMembershipPaymentIntent;