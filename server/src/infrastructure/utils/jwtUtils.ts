import jwt from "jsonwebtoken";
import configuredKeys from "../../configs/envConfig";
import { JWT_CONSTANTS } from "../../configs/constants";

/** JWT TOKEN GENERATION */
export const jwtGenerateToken = (userId: string , role : string): string => {
  const payload = {
    userId: userId,
    role : role
  };
  return jwt.sign(payload, configuredKeys.JWT_SECRET_KEY , { expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN });
};

/** JWT REFRESH TOKEN */
export const jwtGenerateRefreshToken = (userId: string , role : string): string => {
  const payload = {
    userId: userId,
    role: role
  };
  return jwt.sign(payload, configuredKeys.JWT_REFRESH_SECRET_KEY, {
    expiresIn: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN,
  });
};

/** JWT VERIFY TOKEN */
export const jwtVerifyToken = (accessToken: string , SECRET_KEY : string) => {
  jwt.verify(
    accessToken,
    SECRET_KEY,
    (err: any, decode: any) => {
      if (err) {
        return { message: "Invalid Token", decode: null };
      } else {
        return { message: "Verified successfull", decode };
      }
    }
  );
};

/** GENERATE TOKENS */
export const generateTokens = (id: string, role: string) => {
  const generatedAccessToken = jwtGenerateToken(id, role);
  const generatedRefreshToken = jwtGenerateRefreshToken(id, role);
  return { generatedAccessToken, generatedRefreshToken };
};