import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Direccion } from "./Direccion.js";
import { Envio } from "./Envio.js";

@Entity("clientes")
export class Cliente {
    @PrimaryGeneratedColumn({ name: "id_cliente" })
    idCliente!: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre!: string;

    @Column({ type: "varchar", length: 100, unique: true, nullable: false })
    email!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    telefono!: string | null;

    @Column({ type: "enum", enum: ["ACTIVO", "INACTIVO"], default: "ACTIVO" })
    estado!: "ACTIVO" | "INACTIVO";

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0.00, name: "limite_credito" })
    limiteCredito!: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", name: "fecha_registro" })
    fechaRegistro!: Date;

    // Relaciones
    @OneToMany(() => Direccion, (direccion) => direccion.cliente)
    direcciones!: Direccion[];

    @OneToMany(() => Envio, (envio) => envio.cliente)
    envios!: Envio[];
}
