"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareFromidableData = void 0;
const prepareFromidableData = (data) => {
    const preparedData = {};
    Object.keys(data).forEach((key) => {
        preparedData[key] = Array.isArray(data[key])
            ? data[key].length > 1
                ? data[key]
                : data[key][0]
            : data[key];
    });
    return preparedData;
};
exports.prepareFromidableData = prepareFromidableData;
