import { Request, Response } from "express";
import { productoRepository } from "../repository/ProductoRepository.js";

// GETALL
export const getAllProductos = async (req: Request, res: Response) => {
    const productos = await productoRepository.findAll();
    return res.json(productos);
};

// GETBYID
export const getProductoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const producto = await productoRepository.findById(Number(id));
    return res.json(producto);
};

// POST
export const createProducto = async (req: Request, res: Response) => {
    const { nombre, precio, stock, categoriaId } = req.body;
    const producto = await productoRepository.create({ nombre, precio, stock, categoriaId });
    return res.json(producto);
};

// PUT
export const updateProducto = async (req: Request, res: Response) => {
    const { id } = req.params;
    const producto = await productoRepository.update(Number(id), req.body);
    return res.json(producto);
};

// DELETE
export const deleteProducto = async (req: Request, res: Response) => {
    const { id } = req.params;
    const eliminado = await productoRepository.delete(Number(id));
    return res.json(eliminado);
};

// Alias adicionales
export const getProducto = getProductoById;
export const getAll = getAllProductos;
export const getById = getProductoById;
export const create = createProducto;
export const update = updateProducto;
export const remove = deleteProducto;
