"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBookingId = void 0;
const generateBookingId = (prefixId = "ZENDINE") => {
    let randomPart = Math.floor(Math.random() * 10000);
    let timeStamp = Date.now();
    return `${prefixId}-${randomPart}${timeStamp}`;
};
exports.generateBookingId = generateBookingId;
