import fs from "fs";
import { env } from "../../config/env";
import { IResponseData } from "../entities";

export class AppError extends Error {
  public error: Partial<IResponseData<any>>;
  constructor(err: Partial<IResponseData<any>>) {
    super(err.message);
    this.error = err;

    const errorFilePath = this.stack!.split(")")[0];

    this.error.description = `${
      this.error.description ?? this.message
    }-Reference:${!env?.in_prod ? errorFilePath ?? this.stack : ""}`;

    this.error.stack = env?.in_prod ? undefined : this.stack;
    Error.captureStackTrace(this, this.constructor);
  }

  saveLog() {
    const logsDir = "logs";
    let exists = false;
    fs.exists(logsDir, (e) => {
      exists = e;
    });
    if (!exists) fs.mkdir(logsDir, (err) => {});

    const date = new Date(Date.now());
    const data = {
      date,
      ...this.error,
    };
    fs.writeFile(
      `logs/${
        date.toJSON().split("T")[0]
      }-Time-${date.getSeconds()}sec+${date.getMinutes()}min+${date.getHours()}hrs.log`,
      JSON.stringify(data),
      "utf-8",
      () => {}
    );
  }
}
