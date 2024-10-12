import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../global/error";
import { StatusCodes } from "../../../global/enums";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  throw new AppError({
    message: "Resource Not Found",
    status: StatusCodes.notFound,
    type: "Invalid path or url",
  });
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  res
    .status(err?.error?.status ?? StatusCodes.badGateway)
    .json({ ...err, data: null });
};
