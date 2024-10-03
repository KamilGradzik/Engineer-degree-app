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
const logger_1 = __importDefault(require("../middleware/logger"));
const event_service_1 = __importDefault(require("../services/event.service"));
const getEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.month) {
            const results = yield event_service_1.default.getEvents(req.query.month, req.headers.authorization);
            if (results.Success && results.Data) {
                return res.status(200).json({ Status: 200, Data: results.Data });
            }
            else if (!results.Data && results.Success) {
                return res.status(200).json({ Status: 200, Message: 'Events get successful, but there is no data.' });
            }
            else {
                return res.status(401).json({ Status: 401, Message: results.Message });
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: 'Month parameter not provided' });
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const getEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.id) {
            const results = yield event_service_1.default.getEvent(parseInt(req.query.id), req.headers.authorization);
            if (results.Permission == false) {
                return res.status(401).json({ Status: 401, Message: `No permission to this event` });
            }
            if (results.Exist == false) {
                return res.status(404).json({ Status: 404, Data: 'Event not found' });
            }
            if (results.Success) {
                return res.status(200).json({ Status: 200, Data: results.Data });
            }
            else {
                return res.status(401).json({ Status: 401, Message: results.Message });
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: 'Parameter Id not provided' });
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const addEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (!req.body.event_title || !req.body.event_date) {
            return res.status(400).json({ Status: 400, Message: 'Event title and event date are required.' });
        }
        else {
            const results = yield event_service_1.default.addEvent(req.body, req.headers.authorization);
            if (results.Success) {
                return res.status(201).json({ Status: 201, Message: 'Event successfuly added' });
            }
            else {
                return res.status(401).json({ Status: 401, Message: results.Message });
            }
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const updateEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.id) {
            if (!req.body.event_title || !req.body.event_date) {
                return res.status(400).json({ Status: 400, Message: 'Fields title and event description are required' });
            }
            else {
                const results = yield event_service_1.default.updateEvent(req.query.id, req.body, req.headers.authorization);
                if (results.Permission == false) {
                    return res.status(401).json({ Status: 401, Message: `No permission to this event` });
                }
                if (results.Exist == false) {
                    return res.status(404).json({ Status: 404, Message: `Specifed event cannot be updated because doesn't exist` });
                }
                if (results.Success) {
                    return res.status(201).json({ Status: 201, Message: 'Event successfuly updated' });
                }
                else {
                    return res.status(401).json({ Status: 401, Message: results.Message });
                }
            }
        }
        else {
            return res.status(400).json({ Status: 400, Message: 'Event ID parameter not provided!' });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const deleteEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.id) {
            const result = yield event_service_1.default.deleteEvent(req.query.id, req.headers.authorization);
            if (result.Permission == false) {
                return res.status(401).json({ Status: 401, Message: `No permission to this event` });
            }
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Event not found` });
            }
            if (result.Success) {
                return res.status(200).json({ Status: 200, Message: `Event successfuly deleted` });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            return res.status(400).json({ Status: 400, Nessage: 'Parameter ID not provided' });
        }
    }
    catch (e) {
        return res.status(500).json({ Status: 500, Message: e.message });
    }
});
const deleteEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ Status: 401, Message: 'No permission. Please login.' });
        }
        if (req.query.month) {
            const result = yield event_service_1.default.deleteEvents(req.query.month, req.headers.authorization);
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Month events not found` });
            }
            if (result.Success) {
                return res.status(200).json({ Status: 200, Message: 'Month Events successfuly deleted' });
            }
            else {
                return res.status(401).json({ Status: 401, Message: result.Message });
            }
        }
        else {
            const result = yield event_service_1.default.deleteAllEvents(req.headers.authorization);
            if (result.Exist == false) {
                return res.status(404).json({ Status: 404, Message: `Events not found` });
            }
            if (result.Success) {
                return res.status(200).json({ Status: 200, Message: 'Events successfuly deleted' });
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
exports.default = {
    getEvents,
    getEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    deleteEvents,
};
