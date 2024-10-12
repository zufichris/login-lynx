import express from "express";
import router from "./http/routes/route_v1";
import { Start } from "./http/server/httpServer";
import { AppError } from "./global/error";
import { errorHandler, notFound } from "./http/middleware/error";

const app = express();
app.use(
  express.json({
    limit: 1028,
    verify(req, res, buf, encoding) {
      if (buf.byteLength > 1028) {
        throw new AppError({
          message: "File size too large",
        });
      }
    },
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit:  1028,
    verify(req, res, buf, encoding) {
      if (buf.byteLength >  1028) {
        throw new AppError({
          message: "File size too large",
        });
      }
    },
  })
);
app.use("/api/v1", router);
app.use(notFound);
app.use(errorHandler);
Start(app);
export default app;
