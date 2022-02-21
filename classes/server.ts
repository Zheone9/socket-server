import express from "express";
import { SERVER_PORT } from "../global/environment";
import { Server as ServerIO } from "socket.io";
import cors from "cors";
import http from "http";

export default class Server {
  private static _instance: Server;
  public app: express.Application;
  public port: number;

  public io: ServerIO;
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.app.use(cors());
    this.port = SERVER_PORT;
    this.httpServer = new http.Server(this.app);
    this.io = new ServerIO(this.httpServer, {
      cors: {
        origin: ["http://localhost:4200"],
      },
    });
    this.escucharSockets();
  }
  private escucharSockets() {
    console.log("escuchando conexiones");
    this.io.on("connection", (cliente) => {
      console.log("Nuevo cliente");
    });
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
  start(callback: () => void) {
    this.httpServer.listen(this.port, callback);
  }
}
