import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio.js";
import { Almacen } from "./Almacen.js";

@Entity("paquetes")
export class Paquete {
    @PrimaryGeneratedColumn({ name: "id_paquete" })
    idPaquete!: number;

    @Column({ type: "int", name: "id_envio", nullable: false })
    idEnvio!: number;

    @Column({ type: "int", name: "id_almacen", nullable: true })
    idAlmacen!: number | null;

    @Column({ type: "varchar", length: 255, nullable: false })
    descripcion!: string;

    @Column({ type: "decimal", precision: 8, scale: 2, name: "peso_kg", nullable: false })
    pesoKg!: number;

    @Column({ type: "varchar", length: 50, nullable: false })
    dimensiones!: string;

    @Column({
        type: "enum",
        enum: ["EN_ALMACEN", "EN_RUTA", "ENTREGADO", "EXTRAVIADO"],
        default: "EN_ALMACEN"
    })
    estado!: "EN_ALMACEN" | "EN_RUTA" | "ENTREGADO" | "EXTRAVIADO";

    // Relaciones
    @ManyToOne(() => Envio, (envio) => envio.paquetes, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_envio" })
    envio!: Envio;

    @ManyToOne(() => Almacen, (almacen) => almacen.paquetes, { onDelete: "SET NULL" })
    @JoinColumn({ name: "id_almacen" })
    almacen!: Almacen | null;
}
