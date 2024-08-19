import dotenv from "dotenv";
dotenv.config();

const configuredKeys = {
  PORT: process.env.PORT || (5000 as number),
  DB_HOST: process.env.DB_HOST as string,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  CLIENT_URL: process.env.CLIENT_URL as string,
  EMAIL: process.env.EMAIL as string,
  MAILER_PASS_KEY: process.env.MAILER_PASS_KEY as string,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
};

export default configuredKeys;
