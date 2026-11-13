-- ------------------------------------------------------------------------------
-- Script de Limpieza opcional:
-- Si previamente ejecutaste los scripts del examen en ventas_db, corre este script
-- en DBeaver sobre ventas_db para eliminar las tablas del examen que quedaron allí.
-- ------------------------------------------------------------------------------
USE ventas_db;

DROP TABLE IF EXISTS auditoria_envios;
DROP TABLE IF EXISTS historial_rastreo;
DROP TABLE IF EXISTS paquetes;
DROP TABLE IF EXISTS envios;
DROP TABLE IF EXISTS direcciones;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS almacenes;
