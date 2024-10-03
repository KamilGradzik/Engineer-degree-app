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
const db_connection_1 = __importDefault(require("../middleware/db-connection"));
const logger_1 = __importDefault(require("../middleware/logger"));
const auth_1 = __importDefault(require("../middleware/auth"));
const dB = db_connection_1.default;
const getEvents = (month, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const results = yield dB.query(`Select * from events where to_char(event_date, 'Month') like '%${month}%' and userId = ${verifed.Data.userId}`);
            if (results.rowCount > 0) {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get events`);
                return { Success: true, Data: results.rows };
            }
            else {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get events, but recived no data`);
                return { Success: true, Data: null };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Server error: ${e.message}`);
        throw Error('An error ocured while trying to get month events!');
    }
});
const getEvent = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const result = yield dB.query(`Select * from events where id = ${id}`);
            if (result.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get nonexistent event`);
                return { Exist: false };
            }
            if (result.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get not his event`);
                return { Permission: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get event with id: ${id}`);
            return { Success: true, Data: result };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Server error: ${e.message}`);
        throw Error('An error ocured while trying to get specifed event!');
    }
});
const addEvent = (obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User successfuly add event`);
            yield dB.query(`INSERT INTO EVENTS(TITLE,EVENT_DESC,EVENT_DATE,USERID) VALUES ('${obj.event_title}' , '${obj.event_desc}' , '${obj.event_date}', ${verifed.Data.userId})`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Server error: ${e.message}`);
        throw Error('An error ocured while trying to add event!');
    }
});
const updateEvent = (id, obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const event = yield dB.query(`select * from events where id = ${id}`);
            if (event.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent event`);
                return { Exist: false };
            }
            if (event.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update not his event`);
                return { Permission: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly updated event with id: ${id}`);
            yield dB.query(`UPDATE EVENTS SET
                    TITLE = '${obj.event_title}',
                    EVENT_DESC = '${obj.event_desc}',
                    EVENT_DATE = '${obj.event_date}'
                WHERE id = ${id} and userid = ${verifed.Data.userId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Server error: ${e.message}`);
        throw Error('An error ocured while trying to update event');
    }
});
const deleteEvent = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const event = yield dB.query(`select * from events where id = ${id}`);
            if (event.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent event`);
                return { Exist: false };
            }
            if (event.rows[0].userid != verifed.Data.userId) {
                logger_1.default.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete not his event`);
                return { Permission: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted event with id: ${id}`);
            yield dB.query(`Delete from events where id = ${id} and userid = ${verifed.Data.userId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Server error: ${e.message}`);
        throw Error('An error ocured while trying to delete event');
    }
});
const deleteEvents = (month, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const events = yield dB.query(`Select * from events where to_char(event_date, 'Month') like '%${month}%' and userId = ${verifed.Data.userId}`);
            if (events.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent events from month: ${month}`);
                return { Exist: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted events from month: ${month}`);
            yield dB.query(`delete from events where to_char(event_date, 'Month') like '%${month}%' and userId = ${verifed.Data.userId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Server error: ${e.message}`);
        throw Error('An error ocured while trying to delete month events');
    }
});
const deleteAllEvents = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const events = yield dB.query(`Select * from events where userId = ${verifed.Data.userId}`);
            if (events.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent events`);
                return { Exist: false };
            }
            logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted all events`);
            yield dB.query(`delete from events where userId = ${verifed.Data.userId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(`Server error: ${e.message}`);
        throw Error('An error ocured while trying to delete all events');
    }
});
exports.default = {
    getEvents,
    getEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    deleteEvents,
    deleteAllEvents
};
