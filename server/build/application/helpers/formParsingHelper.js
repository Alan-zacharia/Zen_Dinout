"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFormData = void 0;
const formidable_1 = __importDefault(require("formidable"));
const parseFormData = (req) => {
    return new Promise((resolve, reject) => {
        const form = (0, formidable_1.default)({});
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({ fields, files });
            }
        });
    });
};
exports.parseFormData = parseFormData;
