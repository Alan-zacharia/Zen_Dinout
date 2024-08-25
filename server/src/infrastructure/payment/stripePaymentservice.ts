import Stripe from "stripe";
import configuredKeys from "../../configs/envConfig";

const stripe = new Stripe(configuredKeys.STRIPE_SECRET_KEY);

type userData = {
  name : string;
  email: string;
};
export const createPaymentIntent = async (userData: userData, totalCost: number , bookingId : string) => {
  try {
    console.log(userData)
    const user = await stripe.customers.create({
      name: userData.name,
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
              name: "Guests",
              description: "Table booking",
            },
            unit_amount: Math.round(totalCost * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${configuredKeys.CLIENT_URL}/payment-status/${bookingId}?success=true`,
      cancel_url: `${configuredKeys.CLIENT_URL}/payment-status/${bookingId}?status=false`,
    });
    return session;
  } catch (error) {
    throw new Error(
      `Error creating payment session: ${(error as Error).message}`
    );
  }
};
