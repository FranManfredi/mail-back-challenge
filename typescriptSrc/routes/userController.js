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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var prismaClient_js_1 = require("../client/prismaClient.js");
var mailgun = require("mailgun-js");
var nodemailer_1 = require("nodemailer");
var router = (0, express_1.Router)();
var mg = mailgun({
    apiKey: (_a = process.env.MAILGUN_API_KEY) !== null && _a !== void 0 ? _a : "",
    domain: (_b = process.env.MAILGUN_DOMAIN) !== null && _b !== void 0 ? _b : "",
});
var transporter = (0, nodemailer_1.createTransport)({
    host: "outlook.com",
    auth: {
        user: (_c = process.env.SMTP_MAIL) !== null && _c !== void 0 ? _c : "",
        pass: (_d = process.env.SMTP_PASS) !== null && _d !== void 0 ? _d : ""
    }
});
function sendEmails(email, subject, body, ids, recivers, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mg.messages().send({
                        from: "".concat(email, " <").concat(email, ">"),
                        to: recivers,
                        subject: subject,
                        text: body
                    }, function (error, thisbody) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b;
                        var _this = this;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (!error) return [3 /*break*/, 1];
                                    console.log(error);
                                    transporter.sendMail({
                                        from: "".concat(email, " <").concat((_c = process.env.SMTP_MAIL) !== null && _c !== void 0 ? _c : "", ">"),
                                        to: recivers,
                                        subject: subject,
                                        text: body
                                    }, function (err, info) { return __awaiter(_this, void 0, void 0, function () {
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
                                                    return [4 /*yield*/, (0, prismaClient_js_1.postEmail)(email, subject, body, ids)];
                                                case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                                            }
                                        });
                                    }); });
                                    return [3 /*break*/, 3];
                                case 1:
                                    console.log(thisbody);
                                    _b = (_a = res.status(200)).send;
                                    return [4 /*yield*/, (0, prismaClient_js_1.postEmail)(email, subject, body, ids)];
                                case 2: return [2 /*return*/, _b.apply(_a, [_d.sent()])];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
router.post("/sendEmail", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, subject, body, recivers, user, ids, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, subject = _a.subject, body = _a.body, recivers = _a.recivers;
                return [4 /*yield*/, (0, prismaClient_js_1.getUserByEmail)(req.body.decodedToken.username)];
            case 1:
                user = (_b = _c.sent()) !== null && _b !== void 0 ? _b : res.status(401).send("User not found");
                if (!(!subject || !body || !recivers)) return [3 /*break*/, 2];
                return [2 /*return*/, res.status(400).send("Missing fields")];
            case 2:
                if (!(typeof subject !== "string" || typeof body !== "string")) return [3 /*break*/, 3];
                return [2 /*return*/, res.status(400).send("invalid fields")];
            case 3: return [4 /*yield*/, (0, prismaClient_js_1.getNumMailsToday)(user.id)];
            case 4:
                if ((_c.sent()) >= 10) {
                    return [2 /*return*/, res.status(400).send("You have reached the limit of 10 emails per day")];
                }
                _c.label = 5;
            case 5:
                _c.trys.push([5, 7, , 8]);
                return [4 /*yield*/, (0, prismaClient_js_1.getUsersByEmail)(recivers)];
            case 6:
                ids = (_c.sent()).map(function (user) { return user.id; });
                sendEmails(user.email, subject, body, ids, recivers, res);
                return [3 /*break*/, 8];
            case 7:
                error_1 = _c.sent();
                return [2 /*return*/, res.status(400).send("One or more users not found")];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.get("/getEmails", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, prismaClient_js_1.getUserByEmail)(req.body.decodedToken.username)];
            case 1:
                user = (_c = _d.sent()) !== null && _c !== void 0 ? _c : res.status(401).send("User not found");
                _b = (_a = res.status(200)).send;
                return [4 /*yield*/, (0, prismaClient_js_1.getEmails)(user.id)];
            case 2: return [2 /*return*/, _b.apply(_a, [_d.sent()])];
        }
    });
}); });
exports.default = router;
