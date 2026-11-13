import 'dotenv/config';
import app from './app.js';
import { VentasDataSource, ExamenDataSource } from './config/data-source.js';
import { sembrarDatosExamen } from './examen/seed.js';

const PORT = process.env.PORT || 3000;

// Inicialización de ambas bases de datos (Ventas y Examen)
Promise.all([
    VentasDataSource.initialize(),
    ExamenDataSource.initialize()
])
    .then(async ([ventasDb, examenDb]) => {
        console.log(`¡Conexión exitosa a la base de datos de Ventas (${ventasDb.options.database})!`);
        console.log(`¡Conexión exitosa a la base de datos del Examen (${examenDb.options.database})!`);

        try {
            await sembrarDatosExamen(examenDb);
            console.log('✅ Datos iniciales de LogiExpress listos/verificados.');
        } catch (seedErr) {
            console.warn('⚠️ No se pudieron verificar los datos iniciales:', seedErr);
        }

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar con las bases de datos:", error);
    });
