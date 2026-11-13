import { Router } from "express";
import {
    crearEnvio,
    actualizarCostoEnvio,
    asignarPaqueteAlmacen,
    registrarRastreo,
    obtenerEnviosActivos,
    obtenerEnviosPorCliente
} from "../controllers/logiexpress.controller.js";

const router = Router();




router.post("/envios", crearEnvio);

router.put("/envios/:id/costo", actualizarCostoEnvio);


router.post("/almacenes/:id/paquetes", asignarPaqueteAlmacen);


router.post("/envios/:id/rastreo", registrarRastreo);


router.get("/envios", obtenerEnviosActivos);


router.get("/clientes/:id/envios", obtenerEnviosPorCliente);

export default router;
