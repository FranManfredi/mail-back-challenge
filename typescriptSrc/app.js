"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var authController_1 = require("./routes/authController");
var adminController_1 = require("./routes/adminController");
var userController_1 = require("./routes/userController");
var app = express();
var port = 3000;
app.use(express.json());
app.use("/auth", authController_1.default);
app.use("/admin", adminController_1.default);
app.use("/user", userController_1.default);
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
