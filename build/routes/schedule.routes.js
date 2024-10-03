"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schedule_controller_1 = __importDefault(require("../controllers/schedule.controller"));
const router = express_1.default.Router();
router.get('/', schedule_controller_1.default.getShedules);
router.get('/schedule', schedule_controller_1.default.getSchedule);
router.post('/schedule', schedule_controller_1.default.attachGroup);
router.delete('/schedule', schedule_controller_1.default.detachGroup);
router.post('/', schedule_controller_1.default.addSchedule);
router.put('/', schedule_controller_1.default.updateSchedule);
router.delete('/', schedule_controller_1.default.deleteSchedules);
exports.default = router;
