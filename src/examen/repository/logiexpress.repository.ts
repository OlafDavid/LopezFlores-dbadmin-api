import { ExamenDataSource } from "../../config/data-source.js";
import { Cliente } from "../entity/Cliente.js";
import { Envio } from "../entity/Envio.js";
import { Paquete } from "../entity/Paquete.js";
import { Almacen } from "../entity/Almacen.js";
import { HistorialRastreo } from "../entity/HistorialRastreo.js";
import { AuditoriaEnvio } from "../entity/AuditoriaEnvio.js";

export class LogiExpressRepository {
    private clienteRepo = ExamenDataSource.getRepository(Cliente);
    private envioRepo = ExamenDataSource.getRepository(Envio);
    private paqueteRepo = ExamenDataSource.getRepository(Paquete);
    private almacenRepo = ExamenDataSource.getRepository(Almacen);
    private rastreoRepo = ExamenDataSource.getRepository(HistorialRastreo);
    private auditoriaRepo = ExamenDataSource.getRepository(AuditoriaEnvio);

    // =========================================================================
    // ENDPOINT 1: POST /api/envios (Crear envío con paquetes iniciales)
    // =========================================================================
    async crearEnvio(
        datosEnvio: Partial<Envio>,
        paquetes: Partial<Paquete>[]
    ): Promise<Envio> {
        const nuevoEnvio = this.envioRepo.create({
            ...datosEnvio,
            paquetes: paquetes.map((p) => this.paqueteRepo.create(p))
        });
        return await this.envioRepo.save(nuevoEnvio);
    }

    // =========================================================================
    // ENDPOINT 2: PUT /api/envios/:id/costo (Detona Trigger after_update_envio_costo)
    // =========================================================================
    async actualizarCosto(idEnvio: number, nuevoCosto: number): Promise<Envio | null> {
        // Ejecuta UPDATE directo en la base de datos para detonar el trigger MySQL
        await this.envioRepo.update(idEnvio, { costoTotal: nuevoCosto });
        return await this.buscarEnvioPorId(idEnvio);
    }

    // =========================================================================
    // ENDPOINT 3: POST /api/almacenes/:id/paquetes (Detona Trigger before_insert_paquete_almacen)
    // =========================================================================
    async asignarPaqueteAlmacen(
        idAlmacen: number,
        datosPaquete: Partial<Paquete>
    ): Promise<Paquete> {
        const nuevoPaquete = this.paqueteRepo.create({
            ...datosPaquete,
            idAlmacen
        });
        // Si el almacén superó la capacidad máxima, el trigger de MySQL lanzará SQLSTATE 45000
        return await this.paqueteRepo.save(nuevoPaquete);
    }

    // =========================================================================
    // ENDPOINT 4: POST /api/envios/:id/rastreo (Detona Trigger after_insert_historial_rastreo)
    // =========================================================================
    async registrarRastreo(
        idEnvio: number,
        datosRastreo: Partial<HistorialRastreo>
    ): Promise<HistorialRastreo> {
        const nuevoRastreo = this.rastreoRepo.create({
            ...datosRastreo,
            idEnvio
        });
        // Al insertar evento 'ENTREGADO', el trigger actualiza automáticamente el estado en envios
        return await this.rastreoRepo.save(nuevoRastreo);
    }

    // =========================================================================
    // ENDPOINT 5: GET /api/envios (Envíos activos con QueryBuilder)
    // =========================================================================
    async obtenerEnviosActivos(): Promise<Envio[]> {
        return await this.envioRepo
            .createQueryBuilder("envio")
            .leftJoinAndSelect("envio.cliente", "cliente")
            .leftJoinAndSelect("envio.direccionOrigen", "origen")
            .leftJoinAndSelect("envio.direccionDestino", "destino")
            .leftJoinAndSelect("envio.paquetes", "paquetes")
            .leftJoinAndSelect("paquetes.almacen", "almacen")
            .where("envio.estado IN (:...estados)", {
                estados: ["REGISTRADO", "EN_TRANSITO"]
            })
            .orderBy("envio.fechaEnvio", "DESC")
            .getMany();
    }

    // =========================================================================
    // ENDPOINT 6: GET /api/clientes/:id/envios (Historial por cliente)
    // =========================================================================
    async obtenerEnviosPorCliente(idCliente: number): Promise<Envio[]> {
        return await this.envioRepo
            .createQueryBuilder("envio")
            .leftJoinAndSelect("envio.direccionOrigen", "origen")
            .leftJoinAndSelect("envio.direccionDestino", "destino")
            .leftJoinAndSelect("envio.paquetes", "paquetes")
            .leftJoinAndSelect("envio.rastreos", "rastreos")
            .where("envio.idCliente = :idCliente", { idCliente })
            .orderBy("envio.fechaEnvio", "DESC")
            .getMany();
    }

    // =========================================================================
    // MÉTODOS AUXILIARES DE CONSULTA
    // =========================================================================
    async buscarEnvioPorId(idEnvio: number): Promise<Envio | null> {
        return await this.envioRepo.findOne({
            where: { idEnvio },
            relations: {
                cliente: true,
                direccionOrigen: true,
                direccionDestino: true,
                paquetes: true,
                rastreos: true,
                auditorias: true
            }
        });
    }

    async buscarAlmacenPorId(idAlmacen: number): Promise<Almacen | null> {
        return await this.almacenRepo.findOne({
            where: { idAlmacen },
            relations: { paquetes: true }
        });
    }

    async buscarClientePorId(idCliente: number): Promise<Cliente | null> {
        return await this.clienteRepo.findOne({
            where: { idCliente },
            relations: { direcciones: true }
        });
    }

    async obtenerAuditoriasPorEnvio(idEnvio: number): Promise<AuditoriaEnvio[]> {
        return await this.auditoriaRepo.find({
            where: { idEnvio },
            order: { fechaModificacion: "DESC" }
        });
    }
}

export const logiExpressRepository = new LogiExpressRepository();
