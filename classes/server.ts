import express from "express";
import { createServer } from "https";
import { Server as ServerIO, Socket } from "socket.io";
import cors from "cors";
import http from "http";
import * as socket from "../sockets/sockets";
require("dotenv").config();
const fs = require("fs");
const path = require("path");

export default class Server {
  private static _instance: Server;
  public app: express.Application;
  public port: number;

  public io: ServerIO;
  private server: http.Server;

  private constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      next();
    });

    this.port = Number(process.env.PORT);

    this.server = http.createServer(this.app);

    this.io = require("socket.io")(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

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
    this.server.listen(this.port || 3000, callback);
  }
}
