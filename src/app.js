import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "",
    credentials: true,
  })
);
app.use(cookieParser());

//router
import userRouter from "./routers/user.routers.js";
app.use("/api/v1/user", userRouter);

export default app;
