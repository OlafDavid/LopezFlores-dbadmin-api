import { Request, Response } from "express";
import { logiExpressRepository } from "../repository/logiexpress.repository.js";


// ENDPOINT 1: POST /api/envios 

export const crearEnvio = async (req: Request, res: Response) => {
    try {
        const {
            numeroGuia,
            idCliente,
            idDireccionOrigen,
            idDireccionDestino,
            destinatarioNombre,
            costoTotal,
            paquetes
        } = req.body;

        // Validaciones básicas de entrada
        if (!numeroGuia || !idCliente || !idDireccionOrigen || !idDireccionDestino || !destinatarioNombre) {
            return res.status(400).json({
                mensaje: "Faltan campos requeridos para dar de alta el envío (numeroGuia, idCliente, idDireccionOrigen, idDireccionDestino, destinatarioNombre)"
            });
        }

        const listaPaquetes = Array.isArray(paquetes) ? paquetes : [];

        const nuevoEnvio = await logiExpressRepository.crearEnvio(
            {
                numeroGuia,
                idCliente: Number(idCliente),
                idDireccionOrigen: Number(idDireccionOrigen),
                idDireccionDestino: Number(idDireccionDestino),
                destinatarioNombre,
                costoTotal: Number(costoTotal || 0)
            },
            listaPaquetes
        );

        return res.status(201).json({
            mensaje: "Envío registrado exitosamente con sus paquetes iniciales",
            envio: nuevoEnvio
        });
    } catch (error: any) {
        return res.status(500).json({
            mensaje: "Error interno al crear el envío",
            error: error?.message || error
        });
    }
};


// ENDPOINT 2: PUT /api/envios/:id/costo

export const actualizarCostoEnvio = async (req: Request, res: Response) => {
    try {
        const idEnvio = Number(req.params.id);
        const { costoTotal, nuevoCosto, costo } = req.body;

        const costoFinal = Number(costoTotal ?? nuevoCosto ?? costo);

        if (isNaN(costoFinal) || costoFinal < 0) {
            return res.status(400).json({
                mensaje: "Debe proporcionar un valor numérico válido para el nuevo costo (campo: costoTotal)"
            });
        }

        const envioExistente = await logiExpressRepository.buscarEnvioPorId(idEnvio);
        if (!envioExistente) {
            return res.status(404).json({
                mensaje: `No se encontró ningún envío con el ID ${idEnvio}`
            });
        }

        // Actualiza el costo en TypeORM; esto dispara el trigger AFTER UPDATE en MySQL
        const envioActualizado = await logiExpressRepository.actualizarCosto(idEnvio, costoFinal);

        // Obtiene las entradas de auditoría generadas por el trigger para verificar
        const auditorias = await logiExpressRepository.obtenerAuditoriasPorEnvio(idEnvio);

        return res.status(200).json({
            mensaje: "Costo actualizado exitosamente. Trigger 'after_update_envio_costo' detonado.",
            costoAnterior: envioExistente.costoTotal,
            costoNuevo: costoFinal,
            envio: envioActualizado,
            auditoriaGenerada: auditorias[0] ?? null
        });
    } catch (error: any) {
        return res.status(500).json({
            mensaje: "Error interno al actualizar el costo del envío",
            error: error?.message || error
        });
    }
};

// ENDPOINT 3: POST /api/almacenes/:id/paquetes (10 PTS)

export const asignarPaqueteAlmacen = async (req: Request, res: Response) => {
    try {
        const idAlmacen = Number(req.params.id);
        const { idEnvio, descripcion, pesoKg, dimensiones, estado } = req.body;

        if (!idEnvio || !descripcion || !pesoKg || !dimensiones) {
            return res.status(400).json({
                mensaje: "Faltan campos requeridos del paquete (idEnvio, descripcion, pesoKg, dimensiones)"
            });
        }

        const almacen = await logiExpressRepository.buscarAlmacenPorId(idAlmacen);
        if (!almacen) {
            return res.status(404).json({
                mensaje: `No se encontró ningún almacén con el ID ${idAlmacen}`
            });
        }

        // Intenta guardar el paquete en el almacén; si excede la capacidad, el trigger detonará
        const paqueteGuardado = await logiExpressRepository.asignarPaqueteAlmacen(idAlmacen, {
            idEnvio: Number(idEnvio),
            descripcion,
            pesoKg: Number(pesoKg),
            dimensiones,
            estado: estado || "EN_ALMACEN"
        });

        return res.status(201).json({
            mensaje: "Paquete asignado y guardado correctamente en el almacén",
            paquete: paqueteGuardado
        });
    } catch (error: any) {
        // Captura explícita del error lanzado por el trigger de MySQL (SIGNAL SQLSTATE '45000')
        const esErrorCapacidad =
            error?.sqlState === "45000" ||
            error?.errno === 1644 ||
            String(error?.message).includes("45000") ||
            String(error?.sqlMessage).toLowerCase().includes("capacidad");

        if (esErrorCapacidad) {
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                sqlState: error?.sqlState || "45000",
                mensaje: error?.sqlMessage || "Capacidad máxima excedida: El almacén no tiene espacio disponible para recibir más paquetes."
            });
        }

        return res.status(500).json({
            mensaje: "Error interno al asignar paquete al almacén",
            error: error?.message || error
        });
    }
};

// ENDPOINT 4: POST /api/envios/:id/rastreo (10 PTS)

export const registrarRastreo = async (req: Request, res: Response) => {
    try {
        const idEnvio = Number(req.params.id);
        const { ubicacionActual, estadoEvento, observaciones } = req.body;

        if (!ubicacionActual || !estadoEvento) {
            return res.status(400).json({
                mensaje: "Faltan campos requeridos para el rastreo (ubicacionActual, estadoEvento)"
            });
        }

        const envioExistente = await logiExpressRepository.buscarEnvioPorId(idEnvio);
        if (!envioExistente) {
            return res.status(404).json({
                mensaje: `No se encontró el envío con ID ${idEnvio}`
            });
        }

        // Inserta el evento de rastreo. El trigger MySQL actualiza automáticamente la tabla envios si es 'ENTREGADO'
        const nuevoRastreo = await logiExpressRepository.registrarRastreo(idEnvio, {
            ubicacionActual,
            estadoEvento,
            observaciones: observaciones || null
        });

        // Consultamos el envío actualizado para verificar el efecto del trigger
        const envioActualizado = await logiExpressRepository.buscarEnvioPorId(idEnvio);

        return res.status(201).json({
            mensaje: "Evento de rastreo registrado exitosamente. Trigger 'after_insert_historial_rastreo' ejecutado.",
            rastreo: nuevoRastreo,
            estadoEnvioPrevio: envioExistente.estado,
            estadoEnvioActualizado: envioActualizado?.estado,
            fechaEntrega: envioActualizado?.fechaEntrega
        });
    } catch (error: any) {
        return res.status(500).json({
            mensaje: "Error interno al registrar el evento de rastreo",
            error: error?.message || error
        });
    }
};


// ENDPOINT 5: GET /api/envios (10 PTS)

export const obtenerEnviosActivos = async (req: Request, res: Response) => {
    try {
        const enviosActivos = await logiExpressRepository.obtenerEnviosActivos();

        return res.status(200).json({
            total: enviosActivos.length,
            descripcion: "Envíos actualmente activos (REGISTRADO / EN_TRANSITO) con clientes y paquetes",
            envios: enviosActivos
        });
    } catch (error: any) {
        return res.status(500).json({
            mensaje: "Error interno al consultar envíos activos",
            error: error?.message || error
        });
    }
};


// ENDPOINT 6: GET /api/clientes/:id/envios (10 PTS)

export const obtenerEnviosPorCliente = async (req: Request, res: Response) => {
    try {
        const idCliente = Number(req.params.id);

        const cliente = await logiExpressRepository.buscarClientePorId(idCliente);
        if (!cliente) {
            return res.status(404).json({
                mensaje: `No se encontró ningún cliente con el ID ${idCliente}`
            });
        }

        const historialEnvios = await logiExpressRepository.obtenerEnviosPorCliente(idCliente);

        return res.status(200).json({
            cliente: {
                idCliente: cliente.idCliente,
                nombre: cliente.nombre,
                email: cliente.email,
                estado: cliente.estado
            },
            totalEnvios: historialEnvios.length,
            envios: historialEnvios
        });
    } catch (error: any) {
        return res.status(500).json({
            mensaje: "Error interno al consultar el historial de envíos del cliente",
            error: error?.message || error
        });
    }
};
