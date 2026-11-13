
USE base_datos_examen;


-- Reporte de facturación total, envíos entregados y tiempo promedio de entrega en horas.

DROP PROCEDURE IF EXISTS sp_reporte_mensual_cliente;

DELIMITER //

CREATE PROCEDURE sp_reporte_mensual_cliente(
    IN p_cliente_id INT,
    IN p_mes INT,
    IN p_anio INT
)
BEGIN
    SELECT 
        c.id_cliente,
        c.nombre AS nombre_cliente,
        c.email AS email_cliente,
        p_mes AS mes_consulta,
        p_anio AS anio_consulta,
        COUNT(e.id_envio) AS total_envios,
        SUM(CASE WHEN e.estado = 'ENTREGADO' THEN 1 ELSE 0 END) AS envios_entregados,
        SUM(CASE WHEN e.estado = 'EN_TRANSITO' THEN 1 ELSE 0 END) AS envios_en_transito,
        SUM(CASE WHEN e.estado = 'CANCELADO' THEN 1 ELSE 0 END) AS envios_cancelados,
        COALESCE(SUM(e.costo_total), 0.00) AS facturacion_total,
        ROUND(AVG(
            CASE 
                WHEN e.estado = 'ENTREGADO' AND e.fecha_entrega IS NOT NULL 
                THEN TIMESTAMPDIFF(HOUR, e.fecha_envio, e.fecha_entrega) 
                ELSE NULL 
            END
        ), 2) AS tiempo_promedio_entrega_horas
    FROM clientes c
    LEFT JOIN envios e ON c.id_cliente = e.id_cliente
        AND MONTH(e.fecha_envio) = p_mes
        AND YEAR(e.fecha_envio) = p_anio
    WHERE c.id_cliente = p_cliente_id
    GROUP BY c.id_cliente, c.nombre, c.email;
END //

DELIMITER ;


-- Retorna información del envío, desglose de paquetes e historial cronológico de rastreo.

DROP PROCEDURE IF EXISTS sp_obtener_hoja_ruta_envio;

DELIMITER //

CREATE PROCEDURE sp_obtener_hoja_ruta_envio(
    IN p_envio_id INT
)
BEGIN
    -- Resultado 1: Cabecera del Envío, Remitente, Destinatario y Direcciones
    SELECT 
        e.id_envio,
        e.numero_guia,
        e.fecha_envio,
        e.fecha_entrega,
        e.estado AS estado_envio,
        e.costo_total,
        c.id_cliente AS id_remitente,
        c.nombre AS remitente_nombre,
        c.telefono AS remitente_telefono,
        CONCAT(dor.calle, ' #', dor.numero, ', Col. ', dor.colonia, ', ', dor.ciudad, ', ', dor.estado, ' C.P. ', dor.codigo_postal) AS direccion_origen,
        e.destinatario_nombre,
        CONCAT(dde.calle, ' #', dde.numero, ', Col. ', dde.colonia, ', ', dde.ciudad, ', ', dde.estado, ' C.P. ', dde.codigo_postal) AS direccion_destino
    FROM envios e
    INNER JOIN clientes c ON e.id_cliente = c.id_cliente
    INNER JOIN direcciones dor ON e.id_direccion_origen = dor.id_direccion
    INNER JOIN direcciones dde ON e.id_direccion_destino = dde.id_direccion
    WHERE e.id_envio = p_envio_id;

    -- Resultado 2: Desglose de Paquetes contenidos en el envío
    SELECT 
        p.id_paquete,
        p.descripcion,
        p.peso_kg,
        p.dimensiones,
        p.estado AS estado_paquete,
        COALESCE(a.nombre, 'En Tránsito / Sin Almacén') AS almacen_actual
    FROM paquetes p
    LEFT JOIN almacenes a ON p.id_almacen = a.id_almacen
    WHERE p.id_envio = p_envio_id;

    -- Resultado 3: Historial Cronológico de Rastreo
    SELECT 
        h.id_rastreo,
        h.fecha_hora,
        h.ubicacion_actual,
        h.estado_evento,
        h.observaciones
    FROM historial_rastreo h
    WHERE h.id_envio = p_envio_id
    ORDER BY h.fecha_hora ASC;
END //

DELIMITER ;

