import { Socket } from "socket.io";
import socketIO from "socket.io";
import { UsuariosLista } from "../classes/usuarios-lista";
import { Usuario } from "../classes/usuario";

export const usuariosConectados = new UsuariosLista();

export const desconectar = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("disconnect", () => {
    const nombre = usuariosConectados.getUsuario(cliente.id)?.nombre;
    io.emit("mensaje-nuevo", {
      de: "Servidor",
      cuerpo: `${nombre} se ha ido`,
      id: process.env.ANY_ID,
    });
    console.log("Cliente desconectado");
    usuariosConectados.borrarUsuario(cliente.id);

    io.emit("usuarios-activos", usuariosConectados.getLista());
  });
};

export const conectarCliente = (cliente: Socket, io: socketIO.Server) => {
  const usuario = new Usuario(cliente.id);
  usuariosConectados.agregar(usuario);
};

//escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("mensaje", (payload: { de: string; cuerpo: string }) => {
    console.log("Mensaje recibido ", payload);

    //emitir algo a todos los usuarios
    io.emit("mensaje-nuevo", payload);
  });
};

//Informar usuario conectado al chat
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
  cliente.on(
    "configurarUsuario",
    (payload: { nombre: string }, callback: Function) => {
      usuariosConectados.actualizarNombre(cliente.id, payload.nombre);

      callback(
        {
          ok: true,
          id: cliente.id,
          mensaje: `${payload.nombre}, configurado`,
        },
        io.emit("usuarios-activos", usuariosConectados.getLista())
      );
      io.emit("usuarios-activos", usuariosConectados.getLista());
      io.emit("mensaje-nuevo", {
        de: "Servidor",
        cuerpo: `${payload.nombre} se ha unido al chat`,
        id: process.env.ANY_ID,
      });
    }
  );
};
