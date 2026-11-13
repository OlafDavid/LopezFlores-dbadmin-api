

USE ventas_db;


-- Registra en auditoria_envios cualquier cambio en costo_total con OLD, NEW, usuario y fecha.

DROP TRIGGER IF EXISTS after_update_envio_costo;

DELIMITER //

CREATE TRIGGER after_update_envio_costo
AFTER UPDATE ON envios
FOR EACH ROW
BEGIN
    IF OLD.costo_total <> NEW.costo_total THEN
        INSERT INTO auditoria_envios (
            id_envio,
            costo_anterior,
            costo_nuevo,
            usuario,
            fecha_modificacion
        )
        VALUES (
            NEW.id_envio,
            OLD.costo_total,
            NEW.costo_total,
            CURRENT_USER(),
            NOW()
        );
    END IF;
END //

DELIMITER ;



-- Valida que el almacén tenga cupo disponible; si excede la capacidad lanza SIGNAL SQLSTATE '45000'.

DROP TRIGGER IF EXISTS before_insert_paquete_almacen;

DELIMITER //

CREATE TRIGGER before_insert_paquete_almacen
BEFORE INSERT ON paquetes
FOR EACH ROW
BEGIN
    DECLARE v_capacidad_max INT DEFAULT 0;
    DECLARE v_paquetes_actuales INT DEFAULT 0;

    IF NEW.id_almacen IS NOT NULL THEN
        -- Obtener capacidad máxima configurada en el almacén
        SELECT capacidad_maxima INTO v_capacidad_max
        FROM almacenes
        WHERE id_almacen = NEW.id_almacen;

        -- Contar paquetes actualmente asignados a este almacén
        SELECT COUNT(*) INTO v_paquetes_actuales
        FROM paquetes
        WHERE id_almacen = NEW.id_almacen;

        -- Validar si se superó o igualó la capacidad máxima
        IF v_paquetes_actuales >= v_capacidad_max THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Capacidad máxima excedida: El almacén no tiene espacio disponible para recibir más paquetes.';
        END IF;
    END IF;
END //

DELIMITER ;


-- Al insertar un evento con estado 'ENTREGADO', actualiza automáticamente el estado global del envío.
-- Si el evento es 'EN_TRANSITO' y el envío estaba solo 'REGISTRADO', avanza a 'EN_TRANSITO'.

DROP TRIGGER IF EXISTS after_insert_historial_rastreo;

DELIMITER //

CREATE TRIGGER after_insert_historial_rastreo
AFTER INSERT ON historial_rastreo
FOR EACH ROW
BEGIN
    IF NEW.estado_evento = 'ENTREGADO' THEN
        UPDATE envios
        SET estado = 'ENTREGADO',
            fecha_entrega = NEW.fecha_hora
        WHERE id_envio = NEW.id_envio;
    ELSEIF NEW.estado_evento = 'EN_TRANSITO' THEN
        UPDATE envios
        SET estado = 'EN_TRANSITO'
        WHERE id_envio = NEW.id_envio AND estado = 'REGISTRADO';
    END IF;
END //

DELIMITER ;
