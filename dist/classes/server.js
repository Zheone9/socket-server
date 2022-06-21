"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const https_1 = __importDefault(require("https"));
const socket = __importStar(require("../sockets/sockets"));
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const httpsOptions = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: [""],
        credentials: true,
    },
};
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)());
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            next();
        });
        this.port = Number(process.env.PORT);
        this.server = https_1.default.createServer({
            key: fs.readFileSync("server.key"),
            cert: fs.readFileSync("server.cert"),
        }, this.app);
        this.io = require("socket.io")(this.server);
        this.escucharSockets();
    }
    escucharSockets() {
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
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    start(callback) {
        this.server.listen(this.port || 3000, callback);
    }
}
exports.default = Server;
