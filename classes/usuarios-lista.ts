import { Usuario } from "./usuario";

export class UsuariosLista {
  private lista: Usuario[] = [];

  constructor() {}

  //agregar un usuario
  public agregar(usuario: Usuario) {
    this.lista.push(usuario);
    console.log(this.lista);
    return usuario;
  }

  public actualizarNombre(id: string, nombre: string) {
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
  public getLista() {
    return this.lista.filter((usuario) => usuario.nombre !== "sin-name");
  }

  //Retornar usuario
  public getUsuario(id: string) {
    console.log(this.lista);
    return this.lista.find((user) => user.id === id);
  }

  //Obtener usuario en una sala particular
  public getUsuarioEnSala(sala: string) {
    return this.lista.filter((user) => user.sala == sala);
  }

  //Borrar usuario
  public borrarUsuario(id: string) {
    const tempUser = this.getUsuario(id);
    this.lista = this.lista.filter((user) => user.id != id);

    return tempUser;
  }
}
