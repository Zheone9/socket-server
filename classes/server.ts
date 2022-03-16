import express from "express";

import { Server as ServerIO } from "socket.io";
import cors from "cors";
import http from "http";
import * as socket from "../sockets/sockets";
require("dotenv").config();

export default class Server {
  private static _instance: Server;
  public app: express.Application;
  public port: number;

  public io: ServerIO;
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      next();
    });
    this.port = Number(process.env.SERVER_PORT);
    this.httpServer = new http.Server(this.app);
    this.io = new ServerIO(this.httpServer);
    this.escucharSockets();
  }
  private escucharSockets() {
    console.log("escuchando conexiones");

    this.io.on("connection", (cliente) => {
      //Conectar Cliente
      socket.conectarCliente(cliente, this.io);
      // //Obtener usuarios activos
      // socket.obtenerUsuarios(cliente, this.io);
      //configurar usuario
      socket.configurarUsuario(cliente, this.io);
      //Mensajes
      socket.mensaje(cliente, this.io);

      //desconectar
      socket.desconectar(cliente, this.io);
    });
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
  start(callback: () => void) {
    this.httpServer.listen(this.port, callback);
  }
}
