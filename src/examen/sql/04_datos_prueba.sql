

USE ventas_db;


INSERT INTO clientes (id_cliente, nombre, email, telefono, estado, limite_credito) VALUES
(1, 'Empresa Soluciones SA de CV', 'contacto@soluciones.com', '9981234567', 'ACTIVO', 50000.00),
(2, 'María Fernanda Gómez', 'maria.gomez@gmail.com', '9987654321', 'ACTIVO', 15000.00),
(3, 'Comercializadora del Caribe', 'ventas@caribe.com', '9981122334', 'INACTIVO', 0.00);


INSERT INTO direcciones (id_direccion, id_cliente, calle, numero, colonia, ciudad, estado, codigo_postal, tipo) VALUES
(1, 1, 'Av. Bonampak', '120', 'Centro', 'Cancún', 'Quintana Roo', '77500', 'ORIGEN'),
(2, 1, 'Av. Tulum', '45', 'Supermanzana 20', 'Cancún', 'Quintana Roo', '77505', 'DESTINO'),
(3, 2, 'Calle 60', '302', 'Alcalá Martín', 'Mérida', 'Yucatán', '97050', 'ORIGEN'),
(4, 2, 'Av. Paseo Montejo', '500', 'Centro', 'Mérida', 'Yucatán', '97000', 'DESTINO');


-- Nota: 'Almacen Express Norte' tiene capacidad 2 para probar el Trigger de sobrecupo (Error 45000).

INSERT INTO almacenes (id_almacen, nombre, ubicacion, capacidad_maxima) VALUES
(1, 'Almacén Central Cancún', 'Km 12 Carretera Cancún-Aeropuerto', 500),
(2, 'Almacén Distribución Mérida', 'Periférico Norte Tablaje 12345', 300),
(3, 'Almacén Express Norte (Prueba Límite)', 'Av. Kabah con Niños Héroes', 2);


INSERT INTO envios (id_envio, numero_guia, id_cliente, id_direccion_origen, id_direccion_destino, destinatario_nombre, costo_total, fecha_envio, fecha_entrega, estado) VALUES
(1, 'LOGI-2026-0001', 1, 1, 2, 'Ing. Roberto Méndez', 450.00, '2026-11-01 09:00:00', '2026-11-02 14:30:00', 'ENTREGADO'),
(2, 'LOGI-2026-0002', 2, 3, 4, 'Lic. Laura Castillo', 620.00, '2026-11-10 11:15:00', NULL, 'EN_TRANSITO'),
(3, 'LOGI-2026-0003', 1, 1, 4, 'Carlos Salinas', 320.00, '2026-11-12 08:30:00', NULL, 'REGISTRADO');


INSERT INTO paquetes (id_paquete, id_envio, id_almacen, descripcion, peso_kg, dimensiones, estado) VALUES
(1, 1, 1, 'Laptop Dell Latitude 5420', 2.50, '35x25x5 cm', 'ENTREGADO'),
(2, 2, 2, 'Caja de Sensores y Cables Arduino', 4.80, '40x30x20 cm', 'EN_RUTA'),
(3, 3, 1, 'Documentación Legal y Contratos', 0.80, '30x20x3 cm', 'EN_ALMACEN');


INSERT INTO historial_rastreo (id_rastreo, id_envio, fecha_hora, ubicacion_actual, estado_evento, observaciones) VALUES
(1, 1, '2026-11-01 09:15:00', 'Cancún Centro', 'REGISTRADO', 'Envío recibido en sucursal origen'),
(2, 1, '2026-11-01 16:00:00', 'Almacén Central Cancún', 'EN_ALMACEN', 'Paquete clasificado y listo para ruta'),
(3, 1, '2026-11-02 14:30:00', 'Domicilio Destino', 'ENTREGADO', 'Recibido por Roberto Méndez');
