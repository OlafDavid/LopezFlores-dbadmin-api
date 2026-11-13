USE ventas_db;

-- Datos de prueba para Categorías
INSERT INTO categorias (categoria_id, nombre) VALUES
(1, 'Electrónica'),
(2, 'Accesorios'),
(3, 'Cómputo');

-- Datos de prueba para Productos
INSERT INTO productos (producto_id, nombre, precio, stock, categoria_id) VALUES
(1, 'Laptop Lenovo ThinkPad', 14500.00, 10, 3),
(2, 'Mouse Inalámbrico Logitech', 350.00, 25, 2),
(3, 'Monitor Dell 24"', 3200.00, 15, 1);

-- Datos de prueba para Ventas
INSERT INTO ventas (venta_id, fecha, cliente, total) VALUES
(1, NOW(), 'Juan Pérez', 15200.00);

-- Datos de prueba para Detalle de Ventas
INSERT INTO detalle_ventas (detalle_id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 1, 14500.00, 14500.00),
(2, 1, 2, 2, 350.00, 700.00);
