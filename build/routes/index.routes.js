"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_routes_1 = __importDefault(require("./event.routes"));
const mainRouter = express_1.default.Router();
mainRouter.use(event_routes_1.default);
exports.default = mainRouter;
