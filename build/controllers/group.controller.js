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
const group_service_1 = __importDefault(require("../services/group.service"));
const getGroups = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        const result = yield group_service_1.default.getGroups(req.headers.authorization);
        if (result.Success && result.Data) {
            return res.status(200).json({ Status: 200, Data: result.Data });
        }
        else if (result.Success && !result.Data) {
            return res.status(200).json({ Status: 200, Message: "Groups get success, but there is no data" });
        }
        else {
            return res.status(401).json({ Status: 401, Message: result.Message });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const getStudents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.groupId) {
            const result = yield group_service_1.default.getStudents(req.query.groupId, req.headers.authorization);
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: 'No permission. Cannot view students from this group' });
            }
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Group with specifed id doesn't exist` });
            }
            if (result.Success && result.Data) {
                return res.status(200).json({ Status: 200, Data: result.Data });
            }
            else if (result.Success && !result.Data) {
                return res.status(200).json({ Status: 200, Message: "Students get success, but there is no data" });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: 'Parameter groupId not provided' });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const getSubjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.groupId) {
            const result = yield group_service_1.default.getSubjects(req.query.groupId, req.headers.authorization);
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: `No permission. Cannot view subjects of this group` });
            }
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Group with specifed id doesn't exist` });
            }
            if (result.Success && result.Data) {
                return res.status(200).json({ Status: 200, Data: result.Data });
            }
            else if (result.Success && !result.Data) {
                return res.status(200).json({ Status: 200, Message: 'Subjects get succesfuly but there is no data' });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: 'Parameter groupId not provided' });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const getStudentMarks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.studentId) {
            const result = yield group_service_1.default.getStudentMarks(req.query.studentId, req.headers.authorization);
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Student with specifed id doesn't exist` });
            }
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: `No permission. Cannot view student marks ` });
            }
            if (result.Success && result.Data) {
                return res.status(200).json({ Status: 200, Data: result.Data });
            }
            else if (result.Succes && !result.Data) {
                return res.status(200).json({ Status: 200, Message: 'Student marks get successfuly, but there is no data' });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: "Parameter studentId not provided" });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const addGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (!req.body.group_no || !req.body.study_field || !req.body.term || !req.body.study_form || !req.body.study_degree) {
            return res.status(400).json({ Status: 400, Message: 'Fields groupNo, study field, term, study form and study degree are required' });
        }
        else {
            const result = yield group_service_1.default.addGroup(req.body, req.headers.authorization);
            if (result.Success) {
                return res.status(201).json({ Status: 201, Message: result.Message });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const addStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.groupId) {
            if (!req.body.album_no || !req.body.first_name || !req.body.last_name) {
                return res.status(400).json({ Status: 400, Message: 'Fields albumNo, first and last name are required' });
            }
            else {
                const result = yield group_service_1.default.addStudent(req.query.groupId, req.body, req.headers.authorization);
                if (result.Permission == false) {
                    return res.status(401).json({ Status: 401, Message: `You aren't owner of this group, you can't add student` });
                }
                if (result.Exist == false) {
                    return res.status(404).json({ Status: 404, Message: 'Group not found, cannot add student' });
                }
                if (result.Email == false) {
                    return res.status(400).json({ Status: 400, Message: 'Wrong student email, please correct' });
                }
                if (result.Success) {
                    return res.status(201).json({ Status: 201, Message: result.Message });
                }
                else {
                    return res.status(401).json({ Status: 401, Message: result.Message });
                }
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: 'Parameter groupId not provided' });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const addSubject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.groupId) {
            {
                if (!req.body.subject_name || !req.body.subject_type) {
                    return res.status(400).json({ Status: 400, Message: 'All fields are required' });
                }
                const result = yield group_service_1.default.addSubject(req.query.groupId, req.body, req.headers.authorization);
                if (result.Permission == false) {
                    return res.status(401).json({ Status: 401, Message: `You aren't owner of this group, you can't add subject` });
                }
                if (result.Exist == false) {
                    return res.status(404).json({ Status: 404, Message: 'Group not found, cannot add subject' });
                }
                if (!result.Success && result.Attached) {
                    return res.status(400).json({ Status: 400, Message: result.Message });
                }
                if (result.Success && result.Attached) {
                    return res.status(201).json({ Status: 201, Message: result.Message });
                }
                if (result.Succes) {
                    return res.status(201).json({ Status: 201, Message: result.Message });
                }
                else {
                    return res.status(401).json({ Status: 401, Message: result.Message });
                }
            }
        }
        else {
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const addMark = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (!req.query.groupId || !req.query.subjectId) {
            return res.status(400).json({ Status: 400, Message: 'Parameter groupId or subjectId not provided' });
        }
        else {
            if (!req.body.mark_value || !req.body.mark_desc || !req.body.weight || !req.body.studentId) {
                return res.status(400).json({ Status: 400, Message: 'All fields are required' });
            }
            const result = yield group_service_1.default.addMark(req.query.groupId, req.query.subjectId, req.body, req.headers.authorization);
            if (result.SubPermission == false) {
                return res.status(401).json({ Status: 401, Message: `No permission. You aren't owner of this group or subject` });
            }
            if (result.SubExist == false) {
                return res.status(404).json({ Status: 404, Message: `Subject or group not found or subject doesn't belong to this group` });
            }
            if (result.StudExist == false) {
                return res.status(404).json({ Status: 404, Message: `Student not found or doesn't belog to this group` });
            }
            if (result.Success) {
                return res.status(201).json({ Status: 201, Message: 'Mark sucessfuly added to student' });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const updateGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.groupId) {
            if (!req.body.group_no || !req.body.study_field || !req.body.term || !req.body.study_form || !req.body.study_degree) {
                return res.status(400).json({ Status: 400, Message: `Fields groupNo, study field, term, study form and study degree are required` });
            }
            const result = yield group_service_1.default.updateGroup(req.query.groupId, req.body, req.headers.authorization);
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: `No permission. You aren't owner of this group` });
            }
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Group not found, cannot be updated` });
            }
            if (result.Success) {
                return res.status(201).json({ Status: 201, Message: `Group successfuly updated` });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: 'Parameter groupId not provided' });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const updateStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (!req.query.groupId || !req.query.studentId) {
            return res.status(400).json({ Status: 400, Message: 'Parameter groupId or studentId not provided' });
        }
        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.album_no) {
            return res.status(400).json({ Status: 400, Message: 'All fields are required' });
        }
        const result = yield group_service_1.default.updateStudent(req.query.studentId, req.query.groupId, req.body, req.headers.authorization);
        if (result.Permission == false) {
            return res.status(401).json({ Status: 401, Message: `No permission. You can't update student from this group` });
        }
        if (result.Exist == false) {
            return res.status(404).json({ Status: 404, Message: `Group not found. Cannot update student` });
        }
        if (result.Email == false) {
            return res.status(400).json({ Status: 400, Message: `Invalid student email. Please correct` });
        }
        if (result.Student == false) {
            return res.status(404).json({ Status: 404, Message: `Student not found` });
        }
        if (result.Success) {
            return res.status(201).json({ Status: 201, Message: `Student successfuly updated` });
        }
        else {
            return res.status(401).json({ Status: 404, Message: result.Message });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const updateSubject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.subjectId) {
            if (!req.body.subject_name || !req.body.subject_type) {
                return res.status(400).json({ Status: 400, Message: 'All fields are required' });
            }
            const result = yield group_service_1.default.updateSubject(req.query.subjectId, req.body, req.headers.authorization);
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: `No permission. Cannot update subject` });
            }
            if (result.Exist == false) {
                return res.status(404).json({ Stauts: 404, Message: `Subject not found` });
            }
            if (result.Success) {
                return res.status(201).json({ Status: 201, Message: `Subject successfuly updated` });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: 'Parameter subjectId not provided' });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const updateMark = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (!req.query.studentId || !req.query.groupId) {
            return res.status(400).json({ Status: 400, Message: 'Parameter subjectId or groupId not provided' });
        }
        if (!req.body.mark_value || !req.body.mark_desc || !req.body.weight || !req.body.id) {
            return res.status(400).json({ Status: 400, Message: 'All fields are required' });
        }
        else {
            const result = yield group_service_1.default.updateMark(req.query.studentId, req.query.groupId, req.body, req.headers.authorization);
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: 'No permission. Cannot update mark of student from this group' });
            }
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: 'Group not found, cannot update student mark' });
            }
            if (result.StudExist == false) {
                return res.status(404).json({ Status: 404, Message: 'Student not found' });
            }
            if (result.MarkExist == false) {
                return res.status(404).json({ Status: 404, Message: 'Mark not found' });
            }
            if (result.Success) {
                return res.status(201).json({ Status: 201, Message: 'Student mark successfuly updated' });
            }
            else {
                return res.status(404).json({ Status: 404, Message: result.Message });
            }
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const deleteGroups = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.groupId) {
            const result = yield group_service_1.default.deleteGroup(req.query.groupId, req.headers.authorization);
            console.log(result);
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: `No permission. Cannot remove this group` });
            }
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Group not found` });
            }
            if (result.Success) {
                return res.status(200).json({ Status: 200, Message: `Group successfuly deleted` });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            const result = yield group_service_1.default.deleteGroups(req.headers.authorization);
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Groups not found` });
            }
            if (result.Success) {
                return res.status(200).json({ Status: 200, Message: `Groups successfuly deleted` });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const deleteStudents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.groupId) {
            if (req.query.studentId) {
                const result = yield group_service_1.default.deleteStudent(req.query.groupId, req.query.studentId, req.headers.authorization);
                if (result.Permission == false) {
                    return res.status(401).json({ Status: 401, Message: 'No permission. Cannot delete student from this group' });
                }
                if (result.Exist == false) {
                    return res.status(404).json({ Status: 404, Message: 'Group not found, cannot delete student' });
                }
                if (result.Student == false) {
                    return res.status(404).json({ Status: 404, Message: 'Student not found' });
                }
                if (result.Success) {
                    return res.status(200).json({ Status: 200, Message: `Student successfuly deleted` });
                }
                else {
                    return res.status(401).json({ Status: 401, Message: result.Message });
                }
            }
            else {
                const result = yield group_service_1.default.deleteStudents(req.query.groupId, req.headers.authorization);
                if (result.Permission == false) {
                    return res.status(401).json({ Status: 401, Message: 'No permission. Cannot delete students from this group' });
                }
                if (result.Exist == false) {
                    return res.status(404).json({ Status: 404, Message: 'Group not found, cannot delete students' });
                }
                if (result.Students == false) {
                    return res.status(404).json({ Status: 404, Message: 'Students not found' });
                }
                if (result.Success) {
                    return res.status(200).json({ Status: 200, Message: `Students successfuly deleted` });
                }
                else {
                    return res.status(401).json({ Status: 401, Message: result.Message });
                }
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: 'Parameter groupId not provided' });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const deleteDetachSubjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.subjectId) {
            if (req.query.groupId) {
                const result = yield group_service_1.default.detachSubject(req.query.groupId, req.query.subjectId, req.headers.authorization);
                if (result.GrPermission == false || result.SubPermission == false) {
                    return res.status(401).json({ Status: 401, Message: `No Permission to group or subject` });
                }
                if (result.GrExist == false || result.SubExist == false) {
                    return res.status(404).json({ Status: 404, Message: `Group or subject not found` });
                }
                if (result.Success) {
                    return res.status(200).json({ Status: 200, Message: `Subject successfuly detached from group` });
                }
                else {
                    return res.status(401).json({ Status: 401, Message: result.Message });
                }
            }
            else {
                const result = yield group_service_1.default.deleteSubject(req.query.subjectId, req.headers.authorization);
                if (result.Permission == false) {
                    return res.status(401).json({ Status: 401, Message: `No Permission to this subject` });
                }
                if (result.Exist == false) {
                    return res.status(404).json({ Status: 404, Message: `Subject not found` });
                }
                if (result.Success) {
                    return res.status(200).json({ Status: 200, Message: `Subject successfuly deleted` });
                }
                else {
                    return res.status(401).json({ Status: 401, Message: result.Message });
                }
            }
        }
        else if (req.query.groupId) {
            const result = yield group_service_1.default.detachSubjects(req.query.groupId, req.headers.authorization);
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: `No Permission to this group` });
            }
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Group not found` });
            }
            if (result.Detach == false) {
                return res.status(400).json({ Status: 400, Message: `No subjects to detach` });
            }
            if (result.Success) {
                return res.status(200).json({ Status: 200, Message: `Subjects successfuly detached from group` });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            const result = yield group_service_1.default.deleteSubjects(req.headers.authorization);
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Subjects not found` });
            }
            if (result.Success) {
                return res.status(200).json({ Status: 200, Message: `Subjects successfuly deleted` });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const deleteMarks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.studentId) {
            if (req.query.markId) {
                const result = yield group_service_1.default.deleteMark(req.query.markId, req.query.studentId, req.headers.authorization);
                if (result.Permission == false) {
                    return res.status(401).json({ Status: 401, Message: `No perrmision to delete this student mark` });
                }
                if (result.StudExist == false || result.MarkExist == false) {
                    return res.status(404).json({ Status: 404, Message: `Student or mark not found` });
                }
                if (result.Success) {
                    return res.status(200).json({ Status: 200, Message: `Student mark succesfuly deleted` });
                }
                else {
                    return res.status(401).json({ Status: 401, Message: result.Message });
                }
            }
            else {
                const result = yield group_service_1.default.deleteMarks(req.query.studentId, req.headers.authorization);
                if (result.Permission == false) {
                    return res.status(401).json({ Status: 401, Message: `No perrmision to delete this student marks` });
                }
                if (result.StudExist == false || result.MarkExist == false) {
                    return res.status(404).json({ Status: 404, Message: `Student or marks not found` });
                }
                if (result.Success) {
                    return res.status(200).json({ Status: 200, Message: `Student marks succesfuly deleted` });
                }
                else {
                    return res.status(401).json({ Status: 401, Message: result.Message });
                }
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: `Parameter studentId not provided` });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
exports.default = {
    getGroups,
    getStudents,
    getSubjects,
    getStudentMarks,
    addGroup,
    addStudent,
    addSubject,
    addMark,
    updateGroup,
    updateStudent,
    updateSubject,
    updateMark,
    deleteGroups,
    deleteStudents,
    deleteDetachSubjects,
    deleteMarks,
};
