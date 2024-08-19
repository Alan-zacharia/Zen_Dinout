import { v2 as cloudinary } from "cloudinary";
import configuredKeys from "../configs/envConfig";

cloudinary.config({
  cloud_name: configuredKeys.CLOUDINARY_CLOUD_NAME,
  api_key: configuredKeys.CLOUDINARY_API_KEY,
  api_secret: configuredKeys.CLOUDINARY_API_SECRET,
});

export default cloudinary;
