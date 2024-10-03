"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const client = new pg_1.default.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'lectly-app-database',
    password: 'admin',
    port: 5432
});
exports.default = client;
