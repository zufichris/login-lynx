import mongoose from "mongoose";
import { AppError } from "../global/error";

export class DB {
  constructor(private readonly connectionString: string) {}
  private readonly connection?: mongoose.Connection;

  connect(options?: mongoose.ConnectOptions) {
    mongoose
      .connect(this.connectionString)
      .then((con) => {
       return con
      })
      .catch((err: mongoose.MongooseError) => {
        const error = new AppError({
          message: err.message,
          type: "Database Error",
        });
        error.saveLog();
        throw error;
      });
  }
}
