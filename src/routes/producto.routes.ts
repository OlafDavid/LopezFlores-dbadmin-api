import { Router } from "express";
import {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
} from "../controllers/producto.controller.js";

const router = Router();

// GETALL: Obtener todos los productos (/api/productos)
router.get("/", getAllProductos);

// GETBYID: Obtener un producto por ID (/api/productos/:id)
router.get("/:id", getProductoById);

// POST: Crear un nuevo producto (/api/productos y /api/productos/create)
router.post("/", createProducto);
router.post("/create", createProducto);

// PUT: Actualizar un producto por ID (/api/productos/:id)
router.put("/:id", updateProducto);

// DELETE: Eliminar un producto por ID (/api/productos/:id)
router.delete("/:id", deleteProducto);

export default router;
