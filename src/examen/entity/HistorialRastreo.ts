import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio.js";

@Entity("historial_rastreo")
export class HistorialRastreo {
    @PrimaryGeneratedColumn({ name: "id_rastreo" })
    idRastreo!: number;

    @Column({ type: "int", name: "id_envio", nullable: false })
    idEnvio!: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", name: "fecha_hora" })
    fechaHora!: Date;

    @Column({ type: "varchar", length: 150, name: "ubicacion_actual", nullable: false })
    ubicacionActual!: string;

    @Column({
        type: "enum",
        enum: ["REGISTRADO", "EN_TRANSITO", "EN_ALMACEN", "EN_REPARTO", "ENTREGADO", "FALLIDO"],
        name: "estado_evento"
    })
    estadoEvento!: "REGISTRADO" | "EN_TRANSITO" | "EN_ALMACEN" | "EN_REPARTO" | "ENTREGADO" | "FALLIDO";

    @Column({ type: "text", nullable: true })
    observaciones!: string | null;

    // Relación con Envio
    @ManyToOne(() => Envio, (envio) => envio.rastreos, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_envio" })
    envio!: Envio;
}
