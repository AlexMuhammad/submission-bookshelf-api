import Hapi, { Server } from "@hapi/hapi";
require("dotenv").config()

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

  console.log(`Server running at Port ${server.info.uri}`)
  return server
};

init();
