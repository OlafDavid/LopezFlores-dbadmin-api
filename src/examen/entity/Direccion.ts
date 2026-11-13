import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Cliente } from "./Cliente.js";

@Entity("direcciones")
export class Direccion {
    @PrimaryGeneratedColumn({ name: "id_direccion" })
    idDireccion!: number;

    @Column({ type: "int", name: "id_cliente", nullable: false })
    idCliente!: number;

    @Column({ type: "varchar", length: 150, nullable: false })
    calle!: string;

    @Column({ type: "varchar", length: 20, nullable: false })
    numero!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    colonia!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    ciudad!: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    estado!: string;

    @Column({ type: "varchar", length: 10, name: "codigo_postal", nullable: false })
    codigoPostal!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    referencias!: string | null;

    @Column({ type: "enum", enum: ["ORIGEN", "DESTINO", "AMBOS"], default: "DESTINO" })
    tipo!: "ORIGEN" | "DESTINO" | "AMBOS";

    // Relación con Cliente
    @ManyToOne(() => Cliente, (cliente) => cliente.direcciones, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_cliente" })
    cliente!: Cliente;
}
