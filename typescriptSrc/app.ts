import express from "express";
import authController from "./routes/authController";
import adminController from "./routes/adminController";
import userController from "./routes/userController";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/auth", authController);
app.use("/admin", adminController);
app.use("/user", userController);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
