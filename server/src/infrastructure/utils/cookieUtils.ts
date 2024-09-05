import { Response } from "express";

export function setAuthTokenCookie(
  res: Response,
  token_name: string,
  token: string
) {
  res.cookie(token_name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
