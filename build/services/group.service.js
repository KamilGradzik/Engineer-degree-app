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
const auth_1 = __importDefault(require("../middleware/auth"));
const logger_1 = __importDefault(require("../middleware/logger"));
const db_connection_1 = __importDefault(require("../middleware/db-connection"));
const dB = db_connection_1.default;
const getGroups = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const result = yield dB.query(`select * from groups where userid = ${verifed.Data.userId}`);
            if (result.rowCount > 0) {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get groups`);
                return { Success: true, Data: result.rows };
            }
            else {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get groups, but recived no Data`);
                return { Success: true, Data: null };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to get groups");
    }
});
const getStudents = (groupId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkPerm = yield dB.query(`Select * from groups where id = ${groupId}`);
            if (checkPerm.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get students from notexistent group`);
                return { Exist: false };
            }
            if (checkPerm.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get students from not his group`);
                return { Permission: false };
            }
            const results = yield dB.query(`Select * from students where groupid = ${groupId}`);
            if (results.rowCount > 0) {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get students from group with id: ${groupId}`);
                return { Success: true, Data: results.rows };
            }
            else {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get students from group with id: ${groupId}, but recived no Data`);
                return { Success: true, Data: null };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to get students");
    }
});
const getSubjects = (groupId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkAuth = yield dB.query(`select * from groups where id = ${groupId}`);
            if (checkAuth.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get subjects from notexistent group`);
                return { Exist: false };
            }
            if (checkAuth.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get subjects from not his group`);
                return { Permission: false };
            }
            const result = yield dB.query(`select subjectid,subject_name,subject_type
                    from groups_subjects inner join groups on (groups.id = groups_subjects.groupid) 
                    inner join subjects on (subjects.id = groups_subjects.subjectid) where groups.id = ${groupId}`);
            if (result.rowCount > 0) {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get subjects from group with id: ${groupId}`);
                return { Success: true, Data: result.rows };
            }
            else {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get subject from group with id: ${groupId}, but recived no Data`);
                return { Success: true, Data: null };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to get subjects");
    }
});
const getStudentMarks = (studentId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkAuth = yield dB.query(`select * from students join groups on(students.groupid = groups.id) where students.id = ${studentId}`);
            if (checkAuth.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get marks of nonexistent student`);
                return { Exist: false };
            }
            if (checkAuth.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get marks of not his student`);
                return { Permission: false };
            }
            const result = yield dB.query(`select * from marks join subjects on(marks.subjectid = subjects.id) where studentid = ${studentId}`);
            if (result.rowCount > 0) {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get marks of student with id: ${studentId}`);
                return { Success: true, Data: result.rows };
            }
            else {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get marks of student with id: ${studentId}, but recived no Data`);
                return { Success: true, Data: null };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to get student marks");
    }
});
const addGroup = (obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User successfuly add group`);
            yield dB.query(`Insert into groups(group_no, study_field, term, study_form, study_degree, spec, userid) 
                            values(${obj.group_no},'${obj.study_field}', ${obj.term}, '${obj.study_form}','${obj.study_degree}', '${obj.spec}',${verifed.Data.userId})`);
            return { Success: true, Message: 'Group successfuly added' };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to add group");
    }
});
const addStudent = (groupId, obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let regexpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkPerm = yield dB.query(`Select * from groups where id = ${groupId}`);
            if (checkPerm.rowCount < 1) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add student to nonexistent group`);
                return { Exist: false };
            }
            else if (checkPerm.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add student to not his group`);
                return { Permission: false };
            }
            if (!regexpEmail.test(obj.email) && obj.email) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add student with invalid email: ${obj.email}`);
                return { Email: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User successfuly added student to group with id: ${groupId}`);
            yield dB.query(`Insert into students(album_no, first_name, last_name, email, groupid)
                        values(${obj.album_no}, '${obj.first_name}', '${obj.last_name}', '${obj.email.toLowerCase()}', ${groupId})`);
            return { Success: true, Message: 'Student successfuly added to group' };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to add student to group");
    }
});
const addSubject = (groupId, obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkAuth = yield dB.query(`select * from groups where id=${groupId}`);
            if (checkAuth.rowCount = 0) {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add subject to nonexistent group`);
                return { Exist: false };
            }
            if (checkAuth.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add subject to not his group`);
                return { Permission: false };
            }
            const exist = yield dB.query(`select * from subjects 
                where lower(subject_name) like '%${obj.subject_name.toLowerCase()}%' 
                and lower(subject_type) like '%${obj.subject_type.toLowerCase()}%' 
                and userid=${verifed.Data.userId}`);
            if (exist.rowCount > 0) {
                const attached = yield dB.query(`select * from groups_subjects where groupid = ${groupId} and subjectid = ${exist.rows[0].id}`);
                if (attached.rowCount > 0) {
                    logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add subject that already exist and it's attached to this group`);
                    return { Success: false, Attached: true, Message: 'Subject already exist and is attached to this group' };
                }
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User tried to add subject group with id:${groupId}, but it was only attached to this group`);
                yield dB.query(`Insert into groups_subjects values(${groupId},${exist.rows[0].id})`);
                return { Success: true, Attached: true, Message: 'Subject exist, but was attached to group' };
            }
            else {
                yield dB.query(`Insert into subjects(subject_name, subject_type, userid) 
                    values('${obj.subject_name}','${obj.subject_type}',${verifed.Data.userId})`);
                const id = yield dB.query(`select id from subjects 
                    where lower(subject_name) like '%${obj.subject_name.toLowerCase()}%' 
                    and lower(subject_type) like '%${obj.subject_type.toLowerCase()}%' 
                    and userid=${verifed.Data.userId}`);
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User successfuly added subject to group with id: ${groupId}, and subject successfuly attached to this group`);
                yield dB.query(`Insert into groups_subjects values(${groupId},${id.rows[0].id})`);
                return { Success: true, Message: 'Subject sucessfuly added and attached to group' };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to add subject");
    }
});
const addMark = (groupId, subjectId, obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkSub = yield dB.query(`select * from groups_subjects inner join 
                    groups on(groups.id = groups_subjects.groupid) where groupid=${groupId} and subjectid = ${subjectId} `);
            if (checkSub.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add mark of nonexistent subject`);
                return { SubExist: false };
            }
            if (checkSub.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add mark of not his subject`);
                return { SubPermission: false };
            }
            const checkStud = yield dB.query(`select * from students where id=${obj.studentId} and groupid = ${groupId}`);
            if (checkStud.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add mark for nonexistent student`);
                return { StudExist: false };
            }
            else {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User succesfuly added mark of subject with id: ${subjectId}, for student with id: ${obj.studentId}`);
                yield dB.query(`Insert into marks(mark_value, mark_desc, weight, studentid, subjectid)
                    values(${obj.mark_value}, '${obj.mark_desc}',${obj.weight}, ${obj.studentId}, ${subjectId})`);
                return { Success: true };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to add mark to student");
    }
});
const updateGroup = (groupId, obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkGr = yield dB.query(`Select * from groups where id = ${groupId}`);
            if (checkGr.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent group`);
                return { Exist: false };
            }
            if (checkGr.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update not his group`);
                return { Permission: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly updated group with id: ${groupId}`);
            yield dB.query(`Update groups set
                    group_no = ${obj.group_no},
                    study_field = '${obj.study_field}',
                    term = '${obj.term}',
                    study_form = '${obj.study_form}',
                    study_degree = '${obj.study_degree}'
                where id = ${groupId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to update group");
    }
});
const updateStudent = (studentId, groupId, obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let regexpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkGr = yield dB.query(`select * from groups where id = ${groupId}`);
            if (checkGr.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update student from nonexistent group`);
                return { Exist: false };
            }
            if (checkGr.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update student from not his group`);
                return { Permission: false };
            }
            const checkStud = yield dB.query(`select * from students join groups on (groups.id = students.groupid)
                                            where groupid = ${groupId} and students.id=${studentId}`);
            if (checkStud.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent student in group`);
                return { Student: false };
            }
            if (!regexpEmail.test(obj.email)) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update student with invalid email`);
                return { Email: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly updated student with id: ${studentId} from group with id: ${groupId}`);
            yield dB.query(`Update students set
                album_no = ${obj.album_no},
                first_name = '${obj.first_name}',
                last_name = '${obj.last_name}',
                email = '${obj.email}'
                where id = ${studentId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to update student");
    }
});
const updateSubject = (subjectId, obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkSub = yield dB.query(`Select * from subjects where id=${subjectId}`);
            if (checkSub.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent subject`);
                return { Exist: false };
            }
            if (checkSub.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update not his subject`);
                return { Permission: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly updated subject with id: ${subjectId}`);
            yield dB.query(`Update subjects set
                    subject_name = '${obj.subject_name}',
                    subject_type = '${obj.subject_type}'
                where id = ${subjectId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to update subject");
    }
});
const updateMark = (studentId, groupId, obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkGroups = yield dB.query(`select * from groups where id = ${groupId}`);
            if (checkGroups.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update mark of student from nonexistent group`);
                return { Exist: false };
            }
            if (checkGroups.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update mark of student from not his group`);
                return { Permission: false };
            }
            const checkStud = yield dB.query(`select * from students where id = ${studentId}`);
            if (checkStud.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update mark of nonexistent student`);
                return { StudExist: false };
            }
            const checkMark = yield dB.query(`select * from marks where studentid=${studentId} and id=${obj.id}`);
            if (checkMark.rowCount > 0) {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly updated mark with id: ${obj.id} of student with id: ${studentId}`);
                yield dB.query(`update marks set
                            mark_value=${obj.mark_value},
                            mark_desc='${obj.mark_desc}',
                            weight = ${obj.weight}
                where id=${obj.id} and studentid =${studentId}`);
                return { Success: true };
            }
            else {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent mark`);
                return { MarkExist: false };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to update student mark");
    }
});
const deleteGroup = (groupId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkGr = yield dB.query(`Select * from groups where id=${groupId}`);
            if (checkGr.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent group`);
                return { Exist: false };
            }
            if (checkGr.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete not his group`);
                return { Permission: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted group with id: ${groupId}`);
            yield dB.query(`delete from groups where id=${groupId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to delete group");
    }
});
const deleteGroups = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkGr = yield dB.query(`Select * from groups where userid=${verifed.Data.userId}`);
            if (checkGr.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent groups`);
                return { Exist: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly delete all his groups`);
            yield dB.query(`delete from groups where userid=${verifed.Data.userId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to delete group");
    }
});
const deleteStudent = (groupId, studentId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkGr = yield dB.query(`select * from groups where id = ${groupId}`);
            if (checkGr.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete student from nonexistent group`);
                return { Exist: false };
            }
            if (checkGr.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete student from not his group`);
                return { Permission: false };
            }
            const checkStud = yield dB.query(`select * from students join groups on (groups.id = students.groupid)
                                            where groupid = ${groupId} and students.id=${studentId}`);
            if (checkStud.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent student`);
                return { Student: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted student with id: ${studentId} from group with id: ${groupId}`);
            yield dB.query(`Delete from students where id=${studentId} and groupid=${groupId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to remove student");
    }
});
const deleteStudents = (groupId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkGr = yield dB.query(`select * from groups where id = ${groupId}`);
            if (checkGr.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete students from nonexistent group`);
                return { Exist: false };
            }
            if (checkGr.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete students from not his group`);
                return { Permission: false };
            }
            const checkStud = yield dB.query(`select * from students join groups on (groups.id = students.groupid)
                                            where groupid = ${groupId}`);
            if (checkStud.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent students`);
                return { Students: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted students from group with id: ${groupId}`);
            yield dB.query(`Delete from students where groupid=${groupId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to remove students");
    }
});
const deleteSubject = (subjectId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkSub = yield dB.query(`Select * from subjects where id=${subjectId}`);
            if (checkSub.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent subject`);
                return { Exist: false };
            }
            if (checkSub.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete not his subject`);
                return { Permission: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted subject with id: ${subjectId}`);
            yield dB.query(`Delete from subjects where id=${subjectId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to remove subject");
    }
});
const deleteSubjects = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkSub = yield dB.query(`Select * from subjects where userid=${verifed.Data.userId}`);
            if (checkSub.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent subjects`);
                return { Exist: false };
            }
            yield dB.query(`Delete from subjects where userid=${verifed.Data.userId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to remove subjects");
    }
});
const detachSubject = (groupId, subjectId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkGr = yield dB.query(`select * from groups where id=${groupId}`);
            if (checkGr.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach subject from nonexistent subject`);
                return { GrExist: false };
            }
            if (checkGr.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach subject from not his subject`);
                return { GrPermission: false };
            }
            const checkSub = yield dB.query(`Select * from subjects where id=${subjectId}`);
            if (checkSub.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach nonexistent subject`);
                return { SubExist: false };
            }
            if (checkSub.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach not his subject`);
                return { SubPermission: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly detached subject with id: ${subjectId} from group with id: ${groupId}`);
            yield dB.query(`Delete from groups_subjects where groupid=${groupId} and subjectId = ${subjectId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to detach subject from group");
    }
});
const detachSubjects = (groupId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkGr = yield dB.query(`select * from groups where id=${groupId}`);
            if (checkGr.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach subjects from nonexistent group`);
                return { Exist: false };
            }
            if (checkGr.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach subjects from not his group`);
                return { Permission: false };
            }
            const checkAtch = yield dB.query(`Select * from groups_subjects where groupid=${groupId}`);
            if (checkAtch.rowCount > 0) {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly detached subjects from group with id: ${groupId}`);
                yield dB.query(`Delete from groups_subjects where groupid=${groupId}`);
                return { Success: true };
            }
            else {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach nonexistent subjects group`);
                return { Detach: false };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to detach subject from group");
    }
});
const deleteMark = (markId, studentId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkStud = yield dB.query(`select * from students join groups on(students.groupid = groups.id) where students.id=${studentId}`);
            if (checkStud.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete mark of nonexistent student`);
                return { StudExist: false };
            }
            if (checkStud.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete mark of not his student`);
                return { Permission: false };
            }
            const checkMark = yield dB.query(`select * from marks where id=${markId} and studentid=${studentId}`);
            if (checkMark.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent mark`);
                return { MarkExist: false };
            }
            else {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted mark with id: ${markId} of studednt with id: ${studentId}`);
                yield dB.query(`delete from marks where studentid=${studentId} and id=${markId}`);
                return { Success: true };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to remove student mark");
    }
});
const deleteMarks = (studentId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkStud = yield dB.query(`select * from students join groups on(students.groupid = groups.id) where students.id=${studentId}`);
            if (checkStud.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete marks of nonexistent student`);
                return { StudExist: false };
            }
            if (checkStud.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete marks of not his student`);
                return { Permission: false };
            }
            const checkMark = yield dB.query(`select * from marks where studentid=${studentId}`);
            if (checkMark.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent marks`);
                return { MarkExist: false };
            }
            else {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted all marks of student with id: ${studentId}`);
                yield dB.query(`delete from marks where studentid=${studentId}`);
                return { Success: true };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Type:Server error -- Message: ${e.message}`);
        throw Error("An error ocured while trying to remove student mark");
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
    deleteGroup,
    deleteGroups,
    deleteStudent,
    deleteStudents,
    deleteSubject,
    deleteSubjects,
    detachSubject,
    detachSubjects,
    deleteMark,
    deleteMarks
};
