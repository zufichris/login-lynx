import { NextFunction, Request, Response } from "express";

export const AuthMiddleWare =
  () => (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user, "yshbsl;'");
    next()
  };
