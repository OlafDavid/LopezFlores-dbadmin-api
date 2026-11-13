import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio.js";

@Entity("auditoria_envios")
export class AuditoriaEnvio {
    @PrimaryGeneratedColumn({ name: "id_auditoria" })
    idAuditoria!: number;

    @Column({ type: "int", name: "id_envio", nullable: false })
    idEnvio!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "costo_anterior", nullable: false })
    costoAnterior!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "costo_nuevo", nullable: false })
    costoNuevo!: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    usuario!: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", name: "fecha_modificacion" })
    fechaModificacion!: Date;

    // Relación con Envio
    @ManyToOne(() => Envio, (envio) => envio.auditorias, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_envio" })
    envio!: Envio;
}
