import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ExamenDataSource } from '../config/data-source.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sembrarDatosExamen(db?: any) {
    const dataSource = db || ExamenDataSource;
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }

    const sqlPath = path.join(__dirname, 'sql', '04_datos_prueba.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    // Dividir sentencias ignorando comentarios y USE
    const sentencias = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => {
            const clean = s.replace(/--.*$/gm, '').trim();
            return clean.length > 0 && !clean.toLowerCase().startsWith('use ');
        });

    for (const sentencia of sentencias) {
        const queryToRun = sentencia.replace(/INSERT INTO/gi, 'INSERT IGNORE INTO');
        await dataSource.query(queryToRun);
    }
}

// Ejecución directa si se llama por línea de comandos (npm run seed:examen)
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
    (async () => {
        try {
            console.log("Conectando a base_datos_examen...");
            await ExamenDataSource.initialize();
            console.log("Conectado con éxito a la base de datos.");
            await sembrarDatosExamen(ExamenDataSource);
            console.log("✅ ¡Datos de 04_datos_prueba.sql insertados correctamente!");
            await ExamenDataSource.destroy();
            process.exit(0);
        } catch (err) {
            console.error("❌ Error al insertar datos:", err);
            process.exit(1);
        }
    })();
}
