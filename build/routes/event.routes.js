"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = __importDefault(require("../controllers/event.controller"));
const router = express_1.default.Router();
router.get('/', event_controller_1.default.getEvents);
router.get('/event', event_controller_1.default.getEvent);
router.post('/event', event_controller_1.default.addEvent);
router.put('/event', event_controller_1.default.updateEvent);
router.delete('/event', event_controller_1.default.deleteEvent);
router.delete('/', event_controller_1.default.deleteEvents);
exports.default = router;
