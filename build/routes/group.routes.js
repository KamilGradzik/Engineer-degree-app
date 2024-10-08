"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_controller_1 = __importDefault(require("../controllers/group.controller"));
const router = express_1.default.Router();
router.get("/", group_controller_1.default.getGroups);
router.get("/students", group_controller_1.default.getStudents);
router.get("/students/marks", group_controller_1.default.getStudentMarks);
router.get("/subjects", group_controller_1.default.getSubjects);
router.post("/", group_controller_1.default.addGroup);
router.post("/students", group_controller_1.default.addStudent);
router.post("/subjects", group_controller_1.default.addSubject);
router.post("/students/marks", group_controller_1.default.addMark);
router.put("/", group_controller_1.default.updateGroup);
router.put("/students", group_controller_1.default.updateStudent);
router.put("/subjects", group_controller_1.default.updateSubject);
router.put("/students/marks", group_controller_1.default.updateMark);
router.delete("/", group_controller_1.default.deleteGroups);
router.delete('/students', group_controller_1.default.deleteStudents);
router.delete('/subjects', group_controller_1.default.deleteDetachSubjects);
router.delete('/students/marks', group_controller_1.default.deleteMarks);
exports.default = router;
