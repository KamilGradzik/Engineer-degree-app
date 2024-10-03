"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const note_controller_1 = __importDefault(require("../controllers/note.controller"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", note_controller_1.default.getNotes);
router.post("/", note_controller_1.default.addNote);
router.put("/", note_controller_1.default.updateNote);
router.delete("/", note_controller_1.default.deleteNotes);
exports.default = router;
