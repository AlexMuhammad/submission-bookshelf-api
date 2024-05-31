import Hapi, { Server } from "@hapi/hapi";
import dotenv from "dotenv";
import bookRoutes from "./routes/book.route";
dotenv.config();

let server: Server;

const init = async (): Promise<Server> => {
  server = Hapi.server({
    port: process.env.PORT || 4000,
    host: "localhost",
    routes: {
      cors: {
        credentials: true,
      },
    },
  });

  server.route(bookRoutes);
  return server;
};

const start = async (): Promise<void> => {
  console.log(`Server running at Port ${server.info.uri}`);
  server.start();
};

init()
  .then(() => start())
  .catch((err) => console.error("Error While Starting the server", err));
