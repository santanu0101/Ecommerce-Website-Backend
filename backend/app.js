import express from "express";
import userRoute from "./src/routes/user.route.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(express.urlencoded())

app.use(cookieParser())

app.use("/api/user", userRoute);

app.use(errorHandler)

export { app };
