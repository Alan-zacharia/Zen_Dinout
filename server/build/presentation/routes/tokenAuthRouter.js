"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tokenAuthMiddleware_1 = require("../middlewares/tokenAuthMiddleware");
const tokenRouters = (0, express_1.Router)();
tokenRouters.post("/refreshToken", tokenAuthMiddleware_1.refreshAccessToken);
exports.default = tokenRouters;
