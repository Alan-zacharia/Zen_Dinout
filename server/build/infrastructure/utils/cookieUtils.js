"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthTokenCookie = void 0;
function setAuthTokenCookie(res, token_name, token) {
    res.cookie(token_name, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}
exports.setAuthTokenCookie = setAuthTokenCookie;
;
