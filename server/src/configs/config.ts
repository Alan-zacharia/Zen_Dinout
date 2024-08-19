import dotenv from "dotenv";
dotenv.config();

const configuredKeys = {
  PORT: process.env.PORT || (5000 as number),
  DB_HOST: process.env.DB_HOST as string,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
};

export default configuredKeys;
