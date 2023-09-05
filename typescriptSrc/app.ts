import express = require("express");
import authController from "./routes/authController";
import adminController from "./routes/adminController";
import userController from "./routes/userController";
import adminMiddleware  from "./middleware/adminMiddleware";
import userMiddleware  from "./middleware/userMiddleware";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/auth", authController);

app.use(userMiddleware);

app.use("/user", userController);

app.use(adminMiddleware);

app.use("/admin", adminController);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
