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
const getSchedules = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const result = yield dB.query(`select * from schedules where userid=${verifed.Data.userId}`);
            if (result.rowCount > 0) {
                return { Success: true, Data: result.rows };
            }
            else {
                return { Success: true, Data: null };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to get schedules');
    }
});
const getSchedule = (day, begin, end, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const result = yield dB.query(`select * from schedules join groups on(schedules.groupid = groups.id) 
                    join subjects on(schedules.subjectid = subjects.id) 
                    where schedules.userid = ${verifed.Data.userId} and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`);
            if (result.rowCount > 0) {
                return { Success: true, Data: result.rows };
            }
            else {
                return { Exist: false };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to get schedules');
    }
});
const attachGroup = (groupId, day, begin, end, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkSche = yield dB.query(`select * from schedules join groups on(schedules.groupid = groups.id) 
                    join subjects on(schedules.subjectid = subjects.id) 
                    where schedules.userid = ${verifed.Data.userId} and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`);
            if (checkSche.rowCount == 0) {
                return { ScheExist: false };
            }
            const checkGr = yield dB.query(`select * from groups where id=${groupId}`);
            if (checkGr.rowCount == 0) {
                return { GrExist: false };
            }
            if (checkGr.rows[0].userid != verifed.Data.userId) {
                return { GrPermission: false };
            }
            const checkSubGroup = yield dB.query(`select * from groups_subjects where groupid=${groupId} and subjectId=${checkSche.rows[0].subjectid}`);
            if (checkSubGroup.rowCount == 0) {
                return { SubGroupExist: false };
            }
            const checkAttached = yield dB.query(`select * from schedules where lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}' and groupId = ${groupId}`);
            if (checkAttached.rowCount > 0) {
                return { Attached: true };
            }
            yield dB.query(`insert into schedules (WEEK_DAY,TIME_BEGIN,TIME_END,CLASSROOM,FACULTY,USERID,SUBJECTID,GROUPID) values(
                    '${day}',
                    '${begin}',
                    '${end}',
                    '${checkSche.rows[0].classroom}',
                    '${checkSche.rows[0].faculty}',
                    ${verifed.Data.userId},
                    ${checkSche.rows[0].subjectid},
                    ${groupId})`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error("An error ocured while trying to attach group to schedule");
    }
});
const detachGroup = (groupId, day, begin, end, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkSche = yield dB.query(`select * from schedules where schedules.userid = ${verifed.Data.userId} 
            and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`);
            if (checkSche.rowCount == 0) {
                return { ScheExist: false };
            }
            const checkGr = yield dB.query(`select * from groups where id=${groupId}`);
            if (checkGr.rowCount == 0) {
                return { GrExist: false };
            }
            if (checkGr.rows[0].userid != verifed.Data.userId) {
                return { GrPermission: false };
            }
            yield dB.query(`delete from schedules where userid = ${verifed.Data.userId} 
                    and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}' and groupid=${groupId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error("An error ocured while trying to attach group to schedule");
    }
});
const addSchedule = (obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var notShe = [];
        var j = 0;
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkSub = yield dB.query(`Select * from subjects where id=${obj.subjectId}`);
            if (checkSub.rowCount == 0) {
                return { SubExist: false };
            }
            if (checkSub.rows[0].userid != verifed.Data.userId) {
                return { SubPermission: false };
            }
            const checkTime = yield dB.query(`select * from schedules where schedules.userid = ${verifed.Data.userId} 
                and lower(week_day) like '${obj.day.toLowerCase()}' and time_begin between '${obj.begin}' and '${obj.end}'`);
            if (checkTime.rowCount > 0) {
                return { TimeCheck: false };
            }
            for (let i = 0; i < obj.groups.length; i++) {
                const checkGr = yield dB.query(`select * from groups where id=${obj.groups[i]}`);
                if (checkGr.rowCount == 0) {
                    return { GrExist: false };
                }
                if (checkGr.rows[0].userid != verifed.Data.userId) {
                    return { GrPermission: false };
                }
                const checkGrSub = yield dB.query(`select * from groups_subjects where groupid=${obj.groups[i]} and subjectid=${checkSub.rows[0].id}`);
                if (checkGrSub.rowCount == 0) {
                    return { GrSubExist: false };
                }
                const checkScheduled = yield dB.query(`select * from schedules where userid = ${verifed.Data.userId} and groupid=${obj.groups[i]} and subjectid=${checkSub.rows[0].id}`);
                if (checkScheduled.rowCount == 0) {
                    notShe[j] = checkScheduled.rows[i].groupid;
                    j++;
                }
            }
            for (let i = 0; i < obj.groups.length; i++) {
                for (let j = 0; j < notShe.length; j++) {
                    if (notShe[j] == obj.groups[i]) {
                        yield dB.query(`insert into schedules(week_day, time_begin, time_end, classroom, faculty, userid, subjectid, groupid)
                                values('${obj.day}', '${obj.begin}', '${obj.end}', '${obj.classroom}', '${obj.faculty}', ${verifed.Data.userId}, ${obj.subjectId}, ${obj.groups[i]})`);
                    }
                }
            }
            if (notShe.length == 0) {
                return { Success: false, AllSche: true };
            }
            else if (notShe.length == obj.groups.length) {
                return { Success: true, AllSche: false };
            }
            else {
                return { Success: true, NotAllSche: true };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error("An error ocured while trying to add schedule");
    }
});
const updateSchedule = (day, begin, end, obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var notShe = [];
        var SubGr = [];
        var j = 0;
        var z = 0;
        var sameSub = false;
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const checkSche = yield dB.query(`select * from schedules 
                    where userid = ${verifed.Data.userId} and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`);
            if (checkSche.rows[0].subjectid == obj.subjectid) {
                sameSub = true;
            }
            if (checkSche.rowCount == 0) {
                return { Exist: false };
            }
            const checkSub = yield dB.query(`Select * from subjects where id=${obj.subjectid}`);
            if (checkSub.rowCount == 0) {
                return { SubExist: false };
            }
            if (checkSub.rows[0].userid != verifed.Data.userId) {
                return { SubPermission: false };
            }
            if (!sameSub) {
                for (let i = 0; i < checkSche.rowCount; i++) {
                    const checkScheduled = yield dB.query(`select * from schedules where userid = ${verifed.Data.userId} and groupid=${checkSche.rows[i].groupid} and subjectid=${obj.subjectid}`);
                    if (checkScheduled.rowCount == 0) {
                        notShe[j] = checkSche.rows[i].groupid;
                        j++;
                    }
                    const checkGrSub = yield dB.query(`select * from groups_subjects where groupid=${checkSche.rows[i].groupid} and subjectid = ${obj.subjectid}`);
                    if (checkGrSub.rowCount > 0) {
                        SubGr[z] = checkGrSub.rows[0].groupid;
                        z++;
                    }
                }
            }
            const checkTime = yield dB.query(`select * from schedules where userid = ${verifed.Data.userId} 
                    and lower(week_day) like '${obj.day.toLowerCase()}' and time_begin between '${obj.begin}' and '${obj.end}'`);
            if (checkTime.rowCount > 0) {
                return { TimeCheck: false };
            }
            if (!sameSub) {
                for (let i = 0; i < checkSche.rowCount; i++) {
                    for (let j = 0; j < notShe.length; j++) {
                        if (notShe[j] == checkSche.rows[i].groupid) {
                            for (let z = 0; z < SubGr.length; z++) {
                                if (SubGr[z] == checkSche.rows[i].groupid) {
                                    yield dB.query(`Update schedules set
                                        week_day = '${obj.day}',
                                        time_begin = '${obj.begin}',
                                        time_end = '${obj.end}',
                                        classroom = '${obj.classroom}',
                                        faculty = '${obj.faculty}',
                                        subjectid = ${obj.subjectid},
                                        groupid = ${checkSche.rows[i].groupid}
                                        where userid = ${verifed.Data.userId} and 
                                            lower(week_day) like '${day.toLowerCase()}' and 
                                            time_begin = '${begin}' and time_end ='${end}'`);
                                }
                            }
                        }
                    }
                }
            }
            else {
                yield dB.query(`Update schedules set
                        week_day = '${obj.day}',
                        time_begin = '${obj.begin}',
                        time_end = '${obj.end}',
                        classroom = '${obj.classroom}',
                        faculty = '${obj.faculty}'
                        where userid = ${verifed.Data.userId} and 
                            lower(week_day) like '${day.toLowerCase()}' and 
                            time_begin = '${begin}' and time_end ='${end}'`);
            }
            const left = yield dB.query(`select * from schedules where userid = ${verifed.Data.userId} 
                and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`);
            if (left.rowCount > 0) {
                for (let i = 0; i < left.rowCount; i++) {
                    yield dB.query(`delete from schedules where
                         userid = ${verifed.Data.userId} and 
                         lower(week_day) like '${day.toLowerCase()}' and 
                         time_begin = '${begin}' and 
                         time_end ='${end}' and
                         groupid =${left.rows[i].groupid}`);
                }
            }
            if (sameSub) {
                return { Success: true };
            }
            else {
                if (notShe.length == checkSche.rowCount && SubGr.length == checkSche.rowCount) {
                    return { Success: true };
                }
                else if (notShe.length == 0 || SubGr.length == 0) {
                    return { Success: false, Some: false };
                }
                else if (notShe.length != checkSche.rowCount || SubGr.length != checkSche.rowCount) {
                    return { Success: true, Some: true };
                }
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to get schedules');
    }
});
const deleteSchedule = (day, begin, end, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const result = yield dB.query(`select * from schedules where schedules.userid = ${verifed.Data.userId} and 
                        lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`);
            if (result.rowCount > 0) {
                yield dB.query(`delete from schedules where schedules.userid = ${verifed.Data.userId} and 
                        lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`);
                return { Success: true };
            }
            else {
                return { Exist: false };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to get schedules');
    }
});
const deleteDaySchedules = (day, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const result = yield dB.query(`select * from schedules where schedules.userid = ${verifed.Data.userId} and 
                        lower(week_day) like '${day.toLowerCase()}'`);
            if (result.rowCount > 0) {
                yield dB.query(`delete from schedules where schedules.userid = ${verifed.Data.userId} and 
                        lower(week_day) like '${day.toLowerCase()}'`);
                return { Success: true };
            }
            else {
                return { Exist: false };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to get schedules');
    }
});
const deleteSchedules = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const result = yield dB.query(`select * from schedules where schedules.userid = ${verifed.Data.userId}`);
            if (result.rowCount > 0) {
                yield dB.query(`delete from schedules where schedules.userid = ${verifed.Data.userId}`);
                return { Success: true };
            }
            else {
                return { Exist: false };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to get schedules');
    }
});
exports.default = {
    getSchedules,
    getSchedule,
    attachGroup,
    detachGroup,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    deleteDaySchedules,
    deleteSchedules
};
