"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToUTCWithOffset = void 0;
const convertToUTCWithOffset = (time, offsetHours, offsetMinutes) => {
    const date = new Date();
    if (time) {
        const [hours, minutes] = time.split(":").map(Number);
        date.setUTCHours(hours - offsetHours, minutes - offsetMinutes, 0, 0);
    }
    return date;
};
exports.convertToUTCWithOffset = convertToUTCWithOffset;
