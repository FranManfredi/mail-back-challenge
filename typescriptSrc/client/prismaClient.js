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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.getEmails = exports.postEmail = exports.getNumMailsToday = exports.getUsersByEmail = exports.getUserByEmail = exports.postUser = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function postUser(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user.create({
                        data: {
                            email: email,
                            password: password,
                        },
                    })];
                case 1:
                    newUser = _a.sent();
                    return [2 /*return*/, newUser];
            }
        });
    });
}
exports.postUser = postUser;
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            email: email,
                        },
                    })];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, user];
            }
        });
    });
}
exports.getUserByEmail = getUserByEmail;
function getUsersByEmail(emails) {
    return __awaiter(this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user.findMany({
                        where: {
                            email: {
                                in: emails
                            }
                        },
                    })];
                case 1:
                    users = _a.sent();
                    return [2 /*return*/, users];
            }
        });
    });
}
exports.getUsersByEmail = getUsersByEmail;
function getNumMailsToday(id) {
    return __awaiter(this, void 0, void 0, function () {
        var now, startOfToday, endOfToday, mails;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = new Date();
                    startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
                    endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
                    return [4 /*yield*/, prisma.mails.findMany({
                            where: {
                                from: {
                                    id: id
                                },
                                createdAt: {
                                    gte: startOfToday,
                                    lte: endOfToday
                                }
                            }
                        })];
                case 1:
                    mails = _a.sent();
                    return [2 /*return*/, mails.length];
            }
        });
    });
}
exports.getNumMailsToday = getNumMailsToday;
function postEmail(from, subject, body, to) {
    return __awaiter(this, void 0, void 0, function () {
        var newEmail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.mails.create({
                        data: {
                            from: {
                                connect: { id: from.id }
                            },
                            subject: subject,
                            body: body,
                            to: {
                                createMany: {
                                    data: to.map(function (user) { return ({ userId: user.id }); })
                                }
                            }
                        },
                    })];
                case 1:
                    newEmail = _a.sent();
                    return [2 /*return*/, newEmail];
            }
        });
    });
}
exports.postEmail = postEmail;
function getEmails(id) {
    return __awaiter(this, void 0, void 0, function () {
        var emails;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.mails.findMany({
                        where: {
                            to: {
                                some: {
                                    userId: {
                                        equals: id
                                    }
                                }
                            }
                        },
                        select: {
                            id: true,
                            subject: true,
                            body: true,
                            from: {
                                select: {
                                    email: true
                                }
                            }
                        }
                    })];
                case 1:
                    emails = _a.sent();
                    return [2 /*return*/, emails];
            }
        });
    });
}
exports.getEmails = getEmails;
function getStats() {
    return __awaiter(this, void 0, void 0, function () {
        var users, mailCountsByUser, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, prisma.user.findMany({
                            select: {
                                id: true,
                                email: true,
                                recived: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        })];
                case 1:
                    users = _a.sent();
                    mailCountsByUser = users.map(function (user) { return ({
                        userId: user.id,
                        email: user.email,
                        mailCount: user.recived.length,
                    }); });
                    return [2 /*return*/, mailCountsByUser];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getStats = getStats;
exports.default = prisma;
