import { Router } from "express";
import {
    getAllVentas,
    getVentaById,
    createVenta,
    deleteVenta
} from "../controllers/venta.controller.js";

const router = Router();

// GET: Obtener todas las ventas (/api/ventas)
router.get("/", getAllVentas);

// GET: Obtener venta por ID (/api/ventas/:id)
router.get("/:id", getVentaById);

// POST: Crear una venta (/api/ventas)
router.post("/", createVenta);

// DELETE: Eliminar una venta (/api/ventas/:id)
router.delete("/:id", deleteVenta);

export default router;
