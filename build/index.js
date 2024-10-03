"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const note_routes_1 = __importDefault(require("./routes/note.routes"));
const group_routes_1 = __importDefault(require("./routes/group.routes"));
const schedule_routes_1 = __importDefault(require("./routes/schedule.routes"));
const logger_1 = __importDefault(require("./middleware/logger"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config({ path: './src/config/.env' });
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(user_routes_1.default);
app.use('/callendar', event_routes_1.default);
app.use('/notes', note_routes_1.default);
app.use('/groups', group_routes_1.default);
app.use('/schedules', schedule_routes_1.default);
app.listen(process.env.APP_PORT, () => {
    logger_1.default.info(`Server running and listetning on port: ${process.env.APP_PORT}`);
});
