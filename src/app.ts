import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { morganMessageFormat, streamConfig } from "./configs/morgan.configs";
import corsConfiguration from "./configs/cors.configs";
// import { baseUrl } from "./const";
import { globalErrorMiddleware } from "./middlewares/globalError.middleware";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfiguration));
app.use(
  morgan(morganMessageFormat, {
    stream: {
      write: (message: string) => streamConfig(message),
    },
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server Is Running" });
});

/* ====================================|
|------------APP ROUTES V1-------------|
|==================================== */

app.use(globalErrorMiddleware);

export default app;
