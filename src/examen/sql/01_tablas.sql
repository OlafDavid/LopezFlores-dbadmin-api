

CREATE DATABASE IF NOT EXISTS base_datos_examen;
USE base_datos_examen;

-- ------------------------------------------------------------------------------
-- 1. ELIMINACIÓN DE TABLAS EN ORDEN INVERSO DE DEPENDENCIAS (DROP TABLES)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS auditoria_envios;
DROP TABLE IF EXISTS historial_rastreo;
DROP TABLE IF EXISTS paquetes;
DROP TABLE IF EXISTS envios;
DROP TABLE IF EXISTS direcciones;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS almacenes;



CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20) NULL,
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    limite_credito DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;


CREATE TABLE direcciones (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    calle VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    colonia VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    referencias VARCHAR(255) NULL,
    tipo ENUM('ORIGEN', 'DESTINO', 'AMBOS') NOT NULL DEFAULT 'DESTINO',
    CONSTRAINT fk_direcciones_cliente
        FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;


CREATE TABLE almacenes (
    id_almacen INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    ubicacion VARCHAR(200) NOT NULL,
    capacidad_maxima INT NOT NULL,
    CONSTRAINT chk_almacen_capacidad CHECK (capacidad_maxima > 0)
) ENGINE = InnoDB;


CREATE TABLE envios (
    id_envio INT AUTO_INCREMENT PRIMARY KEY,
    numero_guia VARCHAR(50) NOT NULL UNIQUE,
    id_cliente INT NOT NULL,
    id_direccion_origen INT NOT NULL,
    id_direccion_destino INT NOT NULL,
    destinatario_nombre VARCHAR(100) NOT NULL,
    costo_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega DATETIME NULL,
    estado ENUM('REGISTRADO', 'EN_TRANSITO', 'ENTREGADO', 'CANCELADO') NOT NULL DEFAULT 'REGISTRADO',
    CONSTRAINT fk_envios_cliente
        FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_envios_dir_origen
        FOREIGN KEY (id_direccion_origen) REFERENCES direcciones(id_direccion)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_envios_dir_destino
        FOREIGN KEY (id_direccion_destino) REFERENCES direcciones(id_direccion)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_envios_costo CHECK (costo_total >= 0.00)
) ENGINE = InnoDB;


CREATE TABLE paquetes (
    id_paquete INT AUTO_INCREMENT PRIMARY KEY,
    id_envio INT NOT NULL,
    id_almacen INT NULL,
    descripcion VARCHAR(255) NOT NULL,
    peso_kg DECIMAL(8, 2) NOT NULL,
    dimensiones VARCHAR(50) NOT NULL,
    estado ENUM('EN_ALMACEN', 'EN_RUTA', 'ENTREGADO', 'EXTRAVIADO') NOT NULL DEFAULT 'EN_ALMACEN',
    CONSTRAINT fk_paquetes_envio
        FOREIGN KEY (id_envio) REFERENCES envios(id_envio)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_paquetes_almacen
        FOREIGN KEY (id_almacen) REFERENCES almacenes(id_almacen)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_paquetes_peso CHECK (peso_kg > 0)
) ENGINE = InnoDB;


CREATE TABLE historial_rastreo (
    id_rastreo INT AUTO_INCREMENT PRIMARY KEY,
    id_envio INT NOT NULL,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ubicacion_actual VARCHAR(150) NOT NULL,
    estado_evento ENUM('REGISTRADO', 'EN_TRANSITO', 'EN_ALMACEN', 'EN_REPARTO', 'ENTREGADO', 'FALLIDO') NOT NULL,
    observaciones TEXT NULL,
    CONSTRAINT fk_rastreo_envio
        FOREIGN KEY (id_envio) REFERENCES envios(id_envio)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;


CREATE TABLE auditoria_envios (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
    id_envio INT NOT NULL,
    costo_anterior DECIMAL(10, 2) NOT NULL,
    costo_nuevo DECIMAL(10, 2) NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    fecha_modificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auditoria_envio
        FOREIGN KEY (id_envio) REFERENCES envios(id_envio)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;
