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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jwtClient_js_1 = require("../client/jwtClient.js");
var prismaClient_js_1 = require("../client/prismaClient.js");
var mailgun = require("mailgun-js");
var nodemailer = require("nodemailer");
var router = (0, express_1.Router)();
var mg = mailgun({
    apiKey: (_a = process.env.MAILGUN_API_KEY) !== null && _a !== void 0 ? _a : "",
    domain: (_b = process.env.MAILGUN_DOMAIN) !== null && _b !== void 0 ? _b : "",
});
var transporter = nodemailer.createTransport({
    host: "outlook.com",
    auth: {
        user: "franmanfredi@hotmail.com",
        pass: (_c = process.env.SMTP_PASS) !== null && _c !== void 0 ? _c : ""
    }
});
router.post("/sendEmail", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, subject, body, recivers, ftoken, token, error_1, decodedToken, user, userTo;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, subject = _a.subject, body = _a.body, recivers = _a.recivers;
                ftoken = (_b = req.headers.authorization) !== null && _b !== void 0 ? _b : "";
                if (ftoken === "") {
                    return [2 /*return*/, res.status(403).send("Invalid token")];
                }
                token = ftoken.split(" ")[1];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, jwtClient_js_1.validateToken)(token)];
            case 2:
                _c.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                return [2 /*return*/, res.status(403).send("Invalid token")];
            case 4: return [4 /*yield*/, (0, jwtClient_js_1.decodeToken)(token)];
            case 5:
                decodedToken = _c.sent();
                if (!decodedToken) {
                    return [2 /*return*/, res.status(401).send("User not found")];
                }
                return [4 /*yield*/, (0, prismaClient_js_1.getUserByEmail)(decodedToken.username)];
            case 6:
                user = _c.sent();
                return [4 /*yield*/, (0, prismaClient_js_1.getUsersByEmail)(recivers)];
            case 7:
                userTo = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).send("User not found")];
                }
                return [4 /*yield*/, (0, prismaClient_js_1.getNumMailsToday)(user.id)];
            case 8:
                if ((_c.sent()) >= 10) {
                    return [2 /*return*/, res.status(400).send("You have reached the limit of 10 emails per day")];
                }
                return [4 /*yield*/, mg.messages().send({
                        from: "emailChallenge <".concat(user.email, ">"),
                        to: recivers,
                        subject: subject,
                        text: body
                    }, function (error, thisbody) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!error) return [3 /*break*/, 1];
                                    console.log(error);
                                    transporter.sendMail({
                                        from: "".concat(user.email, " <franmanfredi@hotmail.com>"),
                                        to: recivers,
                                        subject: subject,
                                        text: body
                                    }, function (err, info) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    if (!err) return [3 /*break*/, 1];
                                                    console.log(err);
                                                    return [2 /*return*/, res.status(400).send(err)];
                                                case 1:
                                                    console.log(info);
                                                    _b = (_a = res.status(200)).send;
                                                    return [4 /*yield*/, (0, prismaClient_js_1.postEmail)(user, subject, body, userTo)];
                                                case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                                            }
                                        });
                                    }); });
                                    return [3 /*break*/, 3];
                                case 1:
                                    console.log(thisbody);
                                    _b = (_a = res.status(200)).send;
                                    return [4 /*yield*/, (0, prismaClient_js_1.postEmail)(user, subject, body, userTo)];
                                case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 9:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
router.get("/getEmails", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ftoken, token, error_2, decodedToken, user, _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                ftoken = (_c = req.headers.authorization) !== null && _c !== void 0 ? _c : "";
                if (ftoken === "") {
                    return [2 /*return*/, res.status(403).send("Invalid token")];
                }
                token = ftoken.split(" ")[1];
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, jwtClient_js_1.validateToken)(token)];
            case 2:
                _d.sent();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _d.sent();
                return [2 /*return*/, res.status(403).send("Invalid token")];
            case 4: return [4 /*yield*/, (0, jwtClient_js_1.decodeToken)(token)];
            case 5:
                decodedToken = _d.sent();
                if (!decodedToken) {
                    return [2 /*return*/, res.status(401).send("User not found")];
                }
                return [4 /*yield*/, (0, prismaClient_js_1.getUserByEmail)(decodedToken.username)];
            case 6:
                user = _d.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).send("User not found")];
                }
                _b = (_a = res.status(200)).send;
                return [4 /*yield*/, (0, prismaClient_js_1.getEmails)(user.id)];
            case 7: return [2 /*return*/, _b.apply(_a, [_d.sent()])];
        }
    });
}); });
exports.default = router;
