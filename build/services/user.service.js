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
const generateToken_1 = __importDefault(require("../middleware/generateToken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = __importDefault(require("../middleware/logger"));
const userLogin = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = obj.email.toLowerCase();
        const password = obj.password;
        const user = yield db_connection_1.default.query(`select id,email,password from users where email like '${email}'`);
        if (user.rowCount > 0) {
            if (yield bcrypt_1.default.compareSync(password, user.rows[0].password)) {
                const Token = (0, generateToken_1.default)(user.rows[0].id, user.rows[0].password);
                logger_1.default.info(`User[${email}] logged into application`);
                return { Success: true, Message: 'Login success.', AccesToken: Token };
            }
            else {
                logger_1.default.warn(`Login attempt with email[${email}] and password[${password}]`);
                return { Success: false, Message: 'Email or password incorrect.' };
            }
        }
        else {
            logger_1.default.warn(`Login attempt with email[${email}] and password[${password}]`);
            return { Success: false, Message: 'Email or password incorrect or user cannot be found' };
        }
    }
    catch (err) {
        logger_1.default.error(err.message);
    }
});
const userRegister = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let regexpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        let regexpPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
        const user = yield db_connection_1.default.query(`select id,email,password from users where email like '${obj.email.toLowerCase()}'`);
        if (user.rowCount > 0)
            return { Success: false, Message: 'User already exists. Please login' };
        const email = obj.email;
        if (!regexpEmail.test(email))
            return { Success: false, Message: 'Invalid email from. Please correct' };
        const password = obj.password;
        const confirmPassword = obj.confirmPassword;
        if (password != confirmPassword)
            return { Success: false, Message: 'Passwords not match. Please correct' };
        if (!regexpPassword.test(password))
            return { Success: false, Message: 'Password must be at least 8 characters long, have atleast one number, one upper case letter, one lower case letter and one special sign' };
        const genSalt = yield bcrypt_1.default.genSalt(12);
        const hashPassword = bcrypt_1.default.hashSync(password, genSalt);
        let newUser = {
            email: email,
            password: hashPassword
        };
        yield db_connection_1.default.query(`INSERT INTO USERS(email,password) VALUES('${newUser.email.toLowerCase()}', '${newUser.password}')`);
        logger_1.default.info(`New user have been registered with email '${email}'`);
        return { Success: true, Message: 'Account registration success. You can now login.' };
    }
    catch (e) {
        logger_1.default.error(e.message);
        throw Error(e);
    }
});
exports.default = {
    userLogin,
    userRegister
};
