import express = require("express");
import authController from "./routes/authController";
import adminController from "./routes/adminController";
import userController from "./routes/userController";
import adminMiddleware  from "./middleware/adminMiddleware";
import userMiddleware  from "./middleware/userMiddleware";

const app = express(); // Crea una instancia de express
const port = 3000; // Puerto en el que se ejecutará el servidor

app.use(express.json()); // Middleware que permite el uso de JSON en las peticiones

app.use("/auth", authController); // rutas de autenticación

app.use(userMiddleware); // Middleware que comprueba que el usuario esté logueado

app.use("/user", userController); // rutas de usuario

app.use(adminMiddleware); // Middleware que comprueba que el usuario sea administrador

app.use("/admin", adminController); // rutas de administrador


app.listen(port, () => { // Inicia el servidor
  console.log(`Server running on port ${port}`);
});
