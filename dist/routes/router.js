"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = __importDefault(require("../classes/server"));
const sockets_1 = require("../sockets/sockets");
const router = (0, express_1.Router)();
router.get("/mensajes", (req, res) => {
    res.json({
        ok: true,
        mensaje: "Everything is OK",
    });
});
router.post("/mensajes", (req, res) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    res.json({
        ok: true,
        mensaje: "POST, ready",
        de,
        cuerpo,
    });
});
router.post("/mensajes/:id", (req, res) => {
    const { usuario, cuerpo } = req.body.payload;
    const server = server_1.default.instance;
    const id = req.params.id;
    const payload = {
        de: usuario,
        cuerpo,
        type: "private",
    };
    //mensaje privado
    server.io.in(id).emit("mensaje-privado", payload);
    //mensaje a todos
    // server.io.emit("mensaje-nuevo", payload);
    res.json({
        de: usuario,
        cuerpo,
        id: usuario.id,
    });
});
//Servicio para obtener todos los IDS de los usuarios
router.get("/usuarios", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const server = server_1.default.instance;
    const sockets = yield server.io.fetchSockets();
    const clientes = Array.from(sockets).map((s) => s.id);
    if (clientes.length > 0) {
        res.json({
            ok: true,
            clientes,
        });
    }
    else {
        res.json({
            ok: false,
        });
    }
}));
//Obtener usuarios y sus nombres
router.get("/usuarios/detalle", (req, res) => {
    res.json({
        ok: true,
        clientes: sockets_1.usuariosConectados.getLista(),
    });
});
exports.default = router;
