import express from "express";
import router from "./http/routes/route_v1";
import { Start } from "./http/server/httpServer";
import { AppError } from "./global/error";
import { errorHandler, notFound } from "./http/middleware/error";
import path from "path";
import session from "express-session";
import { AuthMiddleWare } from "./http/middleware/auth";
import passport from "passport";

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
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Use your AuthMiddleWare
app.use(AuthMiddleWare());

app.use("/api/v1", router);
app.use(notFound);
app.use(errorHandler);
Start(app);
export default app;
