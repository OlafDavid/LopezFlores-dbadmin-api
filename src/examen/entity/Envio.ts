import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Cliente } from "./Cliente.js";
import { Direccion } from "./Direccion.js";
import { Paquete } from "./Paquete.js";
import { HistorialRastreo } from "./HistorialRastreo.js";
import { AuditoriaEnvio } from "./AuditoriaEnvio.js";

@Entity("envios")
export class Envio {
    @PrimaryGeneratedColumn({ name: "id_envio" })
    idEnvio!: number;

    @Column({ type: "varchar", length: 50, unique: true, name: "numero_guia", nullable: false })
    numeroGuia!: string;

    @Column({ type: "int", name: "id_cliente", nullable: false })
    idCliente!: number;

    @Column({ type: "int", name: "id_direccion_origen", nullable: false })
    idDireccionOrigen!: number;

    @Column({ type: "int", name: "id_direccion_destino", nullable: false })
    idDireccionDestino!: number;

    @Column({ type: "varchar", length: 100, name: "destinatario_nombre", nullable: false })
    destinatarioNombre!: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00, name: "costo_total" })
    costoTotal!: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", name: "fecha_envio" })
    fechaEnvio!: Date;

    @Column({ type: "datetime", nullable: true, name: "fecha_entrega" })
    fechaEntrega!: Date | null;

    @Column({
        type: "enum",
        enum: ["REGISTRADO", "EN_TRANSITO", "ENTREGADO", "CANCELADO"],
        default: "REGISTRADO"
    })
    estado!: "REGISTRADO" | "EN_TRANSITO" | "ENTREGADO" | "CANCELADO";

    // Relaciones
    @ManyToOne(() => Cliente, (cliente) => cliente.envios)
    @JoinColumn({ name: "id_cliente" })
    cliente!: Cliente;

    @ManyToOne(() => Direccion)
    @JoinColumn({ name: "id_direccion_origen" })
    direccionOrigen!: Direccion;

    @ManyToOne(() => Direccion)
    @JoinColumn({ name: "id_direccion_destino" })
    direccionDestino!: Direccion;

    @OneToMany(() => Paquete, (paquete) => paquete.envio, { cascade: true })
    paquetes!: Paquete[];

    @OneToMany(() => HistorialRastreo, (rastreo) => rastreo.envio, { cascade: true })
    rastreos!: HistorialRastreo[];

    @OneToMany(() => AuditoriaEnvio, (auditoria) => auditoria.envio)
    auditorias!: AuditoriaEnvio[];
}
