"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedDate = void 0;
const getFormattedDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const istOffset = 5.5 * 60;
    const localDate = new Date(dateObj.getTime() + istOffset * 60 * 1000);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return localDate.toLocaleDateString('en-IN', options);
};
exports.getFormattedDate = getFormattedDate;
