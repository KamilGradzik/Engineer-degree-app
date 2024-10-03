"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccesToken = (userId, userName) => {
    return jsonwebtoken_1.default.sign({ userId, userName }, process.env.AUTH_SECRET_TOKEN, { expiresIn: '60s' });
};
exports.default = generateAccesToken;
