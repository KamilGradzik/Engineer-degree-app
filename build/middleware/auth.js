"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("./logger"));
const auth = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = jsonwebtoken_1.default.verify(token, process.env.AUTH_SECRET_TOKEN, (err, data) => {
            if (err) {
                return { Success: false, Message: 'Session timed out. Please login again.' };
            }
            else {
                const userData = {
                    userId: data.userId,
                    username: data.userName,
                };
                return { Success: true, Data: userData };
            }
        });
        return verifed;
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error(e.message);
    }
});
exports.default = auth;
