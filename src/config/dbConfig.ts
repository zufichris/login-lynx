import mongoose from "mongoose";
import { AppError } from "../global/error";



export class DB {
  constructor(private readonly connectionString: string) {}
  private readonly connection?: mongoose.Connection;

  async connect(
    options?: mongoose.ConnectOptions
  ): Promise<mongoose.Connection> {
    if (this.connection) return this.connection;

    const connected = await mongoose
      .connect(this.connectionString)
      .catch((err: mongoose.MongooseError) => {
        const error = new AppError({
          message: err.message,
          type: "Database Error",
        });
        error.saveLog();
        throw error;
      });
    return connected.connection;
  }
}
