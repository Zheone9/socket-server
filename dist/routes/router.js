"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
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
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;
    res.json({
        ok: true,
        mensaje: "POST, ready",
        de,
        cuerpo,
        id,
    });
});
exports.default = router;
