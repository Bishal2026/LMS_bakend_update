import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

//router
import userRouter from "./routers/user.routers.js";
import errorMiddlewares from "./middlewares/error.middlewares.js";
import couresRouter from "./routers/coures.routers.js";

import paymentRouter from "./routers/payment.routes.js";

app.use("/api/v1/user", userRouter);

app.use("/api/v1/courses", couresRouter);

app.use("/api/v1/payments", paymentRouter);

app.all("*", (req, res, next) => {
  res.status(404).send("OOPS page not found");
});

app.use(errorMiddlewares);

export default app;
