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
const user_service_1 = __importDefault(require("../services/user.service"));
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ Status: 400, Message: 'All fields are required' });
        }
        let results = yield user_service_1.default.userLogin(req.body);
        if (results === null || results === void 0 ? void 0 : results.Success) {
            return res.status(200).json({ Status: 200, Token: results.AccesToken });
        }
        else {
            return res.status(400).json({ Status: 400, Message: results.Message });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email || !req.body.password || !req.body.confirmPassword) {
            res.status(400).json({ Status: 400, Message: 'All fields are required' });
        }
        else {
            let results = yield user_service_1.default.userRegister(req.body);
            if (results === null || results === void 0 ? void 0 : results.Success) {
                return res.status(201).json({ Status: 201, Message: results.Message });
            }
            else {
                return res.status(400).json({ Status: 400, Message: results.Message });
            }
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
exports.default = {
    loginUser,
    registerUser
};
