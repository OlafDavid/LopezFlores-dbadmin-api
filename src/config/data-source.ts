import "reflect-metadata";
import { DataSource } from "typeorm";

// Entidades de la Base de Datos "Ventas" (el resto de tablas)
import { Categoria } from "../entity/Categoria.js";
import { Producto } from "../entity/Producto.js";
import { Venta } from "../entity/Venta.js";
import { DetalleVenta } from "../entity/DetalleVenta.js";

// Entidades de la Base de Datos "Examen" (LogiExpress)
import { Cliente } from "../examen/entity/Cliente.js";
import { Direccion } from "../examen/entity/Direccion.js";
import { Almacen } from "../examen/entity/Almacen.js";
import { Envio } from "../examen/entity/Envio.js";
import { Paquete } from "../examen/entity/Paquete.js";
import { HistorialRastreo } from "../examen/entity/HistorialRastreo.js";
import { AuditoriaEnvio } from "../examen/entity/AuditoriaEnvio.js";

// =============================================================================
// 1. DATA SOURCE: VENTAS (el resto de tablas)
// =============================================================================
export const VentasDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ventas_db",
    synchronize: false,
    logging: process.env.DB_LOGGING === "true",
    entities: [
        Categoria,
        Producto,
        Venta,
        DetalleVenta
    ],
    subscribers: [],
    migrations: [],
});

// AppDataSource actúa como alias de VentasDataSource para compatibilidad
export const AppDataSource = VentasDataSource;

// =============================================================================
// 2. DATA SOURCE: BASE DE DATOS EXAMEN
// =============================================================================
export const ExamenDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_EXAMEN_NAME || "base_datos_examen",
    synchronize: false,
    logging: process.env.DB_LOGGING === "true",
    entities: [
        Cliente,
        Direccion,
        Almacen,
        Envio,
        Paquete,
        HistorialRastreo,
        AuditoriaEnvio
    ],
    subscribers: [],
    migrations: [],
});
