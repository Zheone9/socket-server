import { Router, Request, Response } from "express";
import Server from "../classes/server";
import { usuariosConectados } from "../sockets/sockets";
const router = Router();

router.get("/mensajes", (req: Request, res: Response) => {
  res.json({
    ok: true,
    mensaje: "Everything is OK",
  });
});

router.post("/mensajes", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;

  res.json({
    ok: true,
    mensaje: "POST, ready",
    de,
    cuerpo,
  });
});

router.post("/mensajes/:id", (req: Request, res: Response) => {
  const { usuario, cuerpo } = req.body.payload;

  const server = Server.instance;
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
router.get("/usuarios", async (req: Request, res: Response) => {
  const server = Server.instance;
  const sockets = await server.io.fetchSockets();

  const clientes = Array.from(sockets).map((s) => s.id);

  if (clientes.length > 0) {
    res.json({
      ok: true,
      clientes,
    });
  } else {
    res.json({
      ok: false,
    });
  }
});

//Obtener usuarios y sus nombres
router.get("/usuarios/detalle", (req: Request, res: Response) => {
  res.json({
    ok: true,
    clientes: usuariosConectados.getLista(),
  });
});

export default router;
