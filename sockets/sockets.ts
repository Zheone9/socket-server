import { Server, Socket } from "socket.io";
import socketIO from "socket.io";

export const desconectar = (cliente: Socket) => {
  cliente.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
};

//escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("mensaje", (payload: { de: string; cuerpo: string }) => {
    console.log("Mensaje recibido ", payload);

    //emitir algo a todos los usuarios
    io.emit("mensaje-nuevo", payload);
  });
};

export const conectado = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("nuevaConexion", (payload: { nombre: string }) => {
    console.log("conexion nueva");
    //informar nuevo nuevo conectado
    io.emit("conexionNueva", payload);
  });
};
