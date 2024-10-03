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
const getNotes = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const results = yield dB.query(`Select * from notes where userid = ${verifed.Data.userId}`);
            if (results.rowCount > 0) {
                logger_1.default.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get notes`);
                return { Success: true, Data: results.rows };
            }
            else {
                logger_1.default.inf(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get notes, but recived no data`);
                return { Success: true, Data: null };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to get notes');
    }
});
const getNote = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const results = yield dB.query(`Select * from notes where id =${id}`);
            if (results.rowCount == 0) {
                logger_1.default.warn(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get notes, but recived no data`);
                return { Exist: false };
            }
            if (results.rows[0].userid != verifed.Data.userId) {
                return { Permission: false };
            }
            else {
                return { Success: true, Data: results.rows };
            }
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to get note');
    }
});
const addNote = (obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            yield dB.query(`Insert into notes(note_content,creation_date,userid) values('${obj.note_content}', '${obj.note_date}',${verifed.Data.userId})`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to add new note');
    }
});
const updateNote = (id, obj, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const result = yield dB.query(`Select * from notes where id=${id}`);
            if (result.rowCount == 0) {
                return { Exist: false };
            }
            if (result.rows[0].userid != verifed.Data.userId) {
                return { Permission: false };
            }
            yield dB.query(`Update notes set note_content = '${obj.note_content}', creation_date = '${obj.note_date}' where id = ${id} and userid = ${verifed.Data.userId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to update note');
    }
});
const deleteNote = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const result = yield dB.query(`Select * from notes where id=${id}`);
            if (result.rowCount == 0) {
                return { Exist: false };
            }
            if (result.rows[0].userid != verifed.Data.userId) {
                return { Permission: false };
            }
            yield dB.query(`delete from notes where id = ${id} and userid = ${verifed.Data.userId}`);
            return { Success: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to update note');
    }
});
const deleteNotes = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifed = yield (0, auth_1.default)(token);
        if (verifed.Success) {
            const result = yield dB.query(`Select * from notes where userid = ${verifed.Data.userId}`);
            if (result.rowCount == 0) {
                return { Exist: false };
            }
            yield dB.query(`delete from notes where userid = ${verifed.Data.userId}`);
            return { Success: true, Deleted: true };
        }
        else {
            return verifed;
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error('An error ocured while trying to update note');
    }
});
exports.default = {
    getNote,
    getNotes,
    addNote,
    updateNote,
    deleteNotes,
    deleteNote
};
