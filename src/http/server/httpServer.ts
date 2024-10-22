import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { env } from "../../config/env";
import { AppError } from "../../global/error";
import { DB } from "../../config/dbConfig";

export function Start(app: Express.Application) {
  const server = createServer(app);
  if (isNaN(Number(env.port)))
    throw new AppError({
      message: "Invalid port number",
      description: "add the env variable PORT, example PORT=5000",
      type: "HTTP Server Connection Error",
    });
  else {
    new DB(env.mongo_uri).connect();
    server.listen(env.port, () => {
      console.log(`App running on http://localhost:${env.port}`);
    });
  }
}
