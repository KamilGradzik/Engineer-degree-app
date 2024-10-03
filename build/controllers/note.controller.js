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
const note_service_1 = __importDefault(require("../services/note.service"));
const getNotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.id) {
            const result = yield note_service_1.default.getNote(req.query.id, req.headers.authorization);
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: `No permission to this note` });
            }
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: 'Note not found' });
            }
            if (result.Success) {
                return res.status(200).json({ Status: 200, Data: result.Data });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            const results = yield note_service_1.default.getNotes(req.headers.authorization);
            if (results.Data && results.Success) {
                return res.status(200).json({ Status: 200, Data: results.Data });
            }
            else if (!results.Data && results.Success) {
                return res.status(200).json({ Status: 200, Message: 'Notes get successful, but there is no data.' });
            }
            else {
                return res.status(401).json({ Status: 401, Message: results.Message });
            }
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const addNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (!req.body.note_content || !req.body.note_date) {
            return res.status(400).json({ Status: 400, Message: 'Note content and note date are required' });
        }
        else {
            const result = yield note_service_1.default.addNote(req.body, req.headers.authorization);
            if (result.Success) {
                return res.status(201).json({ Status: 201, Message: 'Note successfuly added' });
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
const updateNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.id) {
            const result = yield note_service_1.default.updateNote(req.query.id, req.body, req.headers.authorization);
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: 'No permission to this note' });
            }
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Note not found` });
            }
            if (result.Success) {
                return res.status(201).json({ Status: 201, Message: `Note successfuly updated` });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: 'Parameter ID not provided' });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const deleteNotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.id) {
            const result = yield note_service_1.default.deleteNote(req.query.id, req.headers.authorization);
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: 'No permission to this note' });
            }
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Note not found` });
            }
            if (result.Success) {
                return res.status(200).json({ Status: 200, Message: `Note successfuly deleted` });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            const results = yield note_service_1.default.deleteNotes(req.headers.authorization);
            if (results.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Notes not found` });
            }
            if (results.Success) {
                return res.status(200).json({ Status: 200, Message: `Notes successfuly deleted` });
            }
            else {
                return res.status(401).json({ Status: 401, Message: results.Message });
            }
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
exports.default = {
    getNotes,
    updateNote,
    addNote,
    deleteNotes,
};
