"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../configs/constants");
const errorHandler = (err, req, res) => {
    const statusCode = err.statusCode || constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = constants_1.MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        status: statusCode,
        message,
    });
};
exports.default = errorHandler;
