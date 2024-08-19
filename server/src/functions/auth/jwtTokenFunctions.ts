import jwt from "jsonwebtoken";
import configuredKeys from "../../configs/config";

/** JWT TOKEN GENERATION */
export const jwtGenerateToken = (userId: string , role : string): string => {
  const payload = {
    userId: userId,
  };
  return jwt.sign(payload, configuredKeys.JWT_SECRET_KEY as string, { expiresIn: "5s" });
};

/** JWT REFRESH TOKEN */
export const jwtGenerateRefreshToken = (userId: string): string => {
  const payload = {
    userId: userId,
  };
  return jwt.sign(payload, configuredKeys.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "2d",
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
