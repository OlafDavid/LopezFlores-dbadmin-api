-- ------------------------------------------------------------------------------
-- Base de datos: ventas_db ("el resto" de tablas)
-- Tablas: categorias, productos, ventas, detalle_ventas
-- ------------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS ventas_db;
USE ventas_db;

-- ------------------------------------------------------------------------------
-- 1. ELIMINACIÓN DE TABLAS EN ORDEN INVERSO DE DEPENDENCIAS (DROP TABLES)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS detalle_ventas;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;

-- ------------------------------------------------------------------------------
-- 2. CREACIÓN DE TABLAS
-- ------------------------------------------------------------------------------

-- Tabla 1: Categorías
CREATE TABLE categorias (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
) ENGINE = InnoDB;

-- Tabla 2: Productos
CREATE TABLE productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria_id INT NULL,
    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Tabla 3: Ventas
CREATE TABLE ventas (
    venta_id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cliente VARCHAR(100) NOT NULL,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00
) ENGINE = InnoDB;

-- Tabla 4: Detalle de Ventas
CREATE TABLE detalle_ventas (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_detalles_venta
        FOREIGN KEY (venta_id) REFERENCES ventas(venta_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_detalles_producto
        FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB;
