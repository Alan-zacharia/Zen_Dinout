import Stripe from "stripe";
import configuredKeys from "../../configs/config";

const stripe = new Stripe(configuredKeys.STRIPE_SECRET_KEY);

export const paymentUserDataRetreival = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.checkout.sessions.retrieve(paymentIntentId as string);
    return paymentIntent;
  } catch (error) {
    throw new Error(
      `Error, retrieving payment session: ${(error as Error).message}`
    );
  }
};
