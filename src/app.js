import express from "express";

import authController from "./routes/authController.js";
import adminController from "./routes/adminController.js";
import userController from "./routes/userController.js";

const app = express();
app.use(express.json())

app.use("/auth", authController);
app.use("/admin", adminController);
app.use("/user", userController);

app.listen(3000)
console.log("Server running on port 3000")