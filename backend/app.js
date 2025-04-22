import express from "express";
import userRoute from "./src/routes/user.route.js";
import productRoute from "./src/routes/product.route.js"
import cartRoute from "./src/routes/cart.route.js"
import orderRoute from "./src/routes/order.route.js"
import catagoryRoute from "./src/routes/catagories.route.js"
import paymentRoute from "./src/routes/payment.route.js"
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(express.urlencoded())

app.use(cookieParser())

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/category", catagoryRoute )
app.use("/api/payment", paymentRoute)


app.use(errorHandler)

export { app };
