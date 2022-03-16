"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosLista = void 0;
class UsuariosLista {
    constructor() {
        this.lista = [];
    }
    //agregar un usuario
    agregar(usuario) {
        this.lista.push(usuario);
        console.log(this.lista);
        return usuario;
    }
    actualizarNombre(id, nombre) {
        for (let usuario of this.lista) {
            if (usuario.id === id) {
                usuario.nombre = nombre;
                break;
            }
        }
        console.log("==actualizando usuario===");
        console.log(this.lista);
        return nombre;
    }
    //Obtener lista de usuarios
    getLista() {
        return this.lista.filter((usuario) => usuario.nombre !== "sin-name");
    }
    //Retornar usuario
    getUsuario(id) {
        console.log(this.lista);
        return this.lista.find((user) => user.id === id);
    }
    //Obtener usuario en una sala particular
    getUsuarioEnSala(sala) {
        return this.lista.filter((user) => user.sala == sala);
    }
    //Borrar usuario
    borrarUsuario(id) {
        const tempUser = this.getUsuario(id);
        this.lista = this.lista.filter((user) => user.id != id);
        return tempUser;
    }
}
exports.UsuariosLista = UsuariosLista;
