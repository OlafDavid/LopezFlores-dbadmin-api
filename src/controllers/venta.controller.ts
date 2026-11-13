import { Request, Response } from "express";
import { ventaRepository } from "../repository/VentaRepository.js";

// GETALL: Obtener todas las ventas con sus detalles
export const getAllVentas = async (req: Request, res: Response) => {
    try {
        const ventas = await ventaRepository.findAll();
        return res.json(ventas);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener ventas", error });
    }
};

// GETBYID: Obtener una venta por ID
export const getVentaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const venta = await ventaRepository.findById(Number(id));
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        return res.json(venta);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener la venta", error });
    }
};

// POST: Crear una nueva venta con sus detalles
export const createVenta = async (req: Request, res: Response) => {
    try {
        const { cliente, total, detalles } = req.body;
        const nuevaVenta = await ventaRepository.create({ cliente, total, detalles });
        return res.status(201).json(nuevaVenta);
    } catch (error) {
        return res.status(500).json({ message: "Error al crear la venta", error });
    }
};

// DELETE: Eliminar una venta por ID
export const deleteVenta = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const eliminado = await ventaRepository.delete(Number(id));
        return res.json({ deleted: eliminado });
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar la venta", error });
    }
};
