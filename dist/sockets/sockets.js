"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarUsuario = exports.mensaje = exports.conectarCliente = exports.desconectar = exports.usuariosConectados = void 0;
const usuarios_lista_1 = require("../classes/usuarios-lista");
const usuario_1 = require("../classes/usuario");
exports.usuariosConectados = new usuarios_lista_1.UsuariosLista();
const desconectar = (cliente, io) => {
    cliente.on("disconnect", () => {
        var _a;
        const nombre = (_a = exports.usuariosConectados.getUsuario(cliente.id)) === null || _a === void 0 ? void 0 : _a.nombre;
        io.emit("mensaje-nuevo", {
            de: "Servidor",
            cuerpo: `${nombre} se ha ido`,
            id: process.env.ANY_ID,
        });
        console.log("Cliente desconectado");
        exports.usuariosConectados.borrarUsuario(cliente.id);
        io.emit("usuarios-activos", exports.usuariosConectados.getLista());
    });
};
exports.desconectar = desconectar;
const conectarCliente = (cliente, io) => {
    const usuario = new usuario_1.Usuario(cliente.id);
    exports.usuariosConectados.agregar(usuario);
};
exports.conectarCliente = conectarCliente;
//escuchar mensajes
const mensaje = (cliente, io) => {
    cliente.on("mensaje", (payload) => {
        console.log("Mensaje recibido ", payload);
        //emitir algo a todos los usuarios
        io.emit("mensaje-nuevo", payload);
    });
};
exports.mensaje = mensaje;
//Informar usuario conectado al chat
const configurarUsuario = (cliente, io) => {
    cliente.on("configurarUsuario", (payload, callback) => {
        var _a;
        const viejoNombre = (_a = exports.usuariosConectados.getUsuario(cliente.id)) === null || _a === void 0 ? void 0 : _a.nombre;
        const nuevonombre = exports.usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        callback({
            ok: true,
            id: cliente.id,
            mensaje: `${payload.nombre}, configurado`,
        });
        io.emit("usuarios-activos", exports.usuariosConectados.getLista());
        if (nuevonombre === "sin-name") {
            io.emit("mensaje-nuevo", {
                de: "Servidor",
                cuerpo: `${viejoNombre} se ha ido`,
                id: process.env.ANY_ID,
            });
        }
        else if (nuevonombre !== "sin-name") {
            io.emit("mensaje-nuevo", {
                de: "Servidor",
                cuerpo: `${nuevonombre} se ha unido al chat`,
                id: process.env.ANY_ID,
            });
        }
    });
};
exports.configurarUsuario = configurarUsuario;
//emitir usuarios a un usuario
// export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
//   cliente.on("obtener-usuarios", () => {
//     io.emit("usuarios-activos", usuariosConectados.getLista());
//   });
// };
