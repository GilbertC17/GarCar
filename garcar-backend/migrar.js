const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

console.log("⏳ Conectando a la nube de Aiven...");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true 
});

try {
    // Leemos tu archivo exportado
    let sql = fs.readFileSync('C:/xamppp/garcar_db.sql', 'utf8');
    
    // --- LA MAGIA NUEVA: Apagamos la regla estricta de Aiven temporalmente ---
    sql = "SET SESSION sql_require_primary_key = 0;\n" + sql;
    
    console.log("🚀 Archivo leído. Relajando seguridad e inyectando tablas...");
    
    connection.query(sql, (err) => {
        if (err) {
            console.error("❌ Error al inyectar los datos:\n", err.message);
        } else {
            console.log("✅ ¡MIGRACIÓN EXITOSA! Tus pollos, huevos y usuarios ya están en internet.");
        }
        connection.end();
    });
} catch (error) {
    console.error("❌ No se pudo encontrar el archivo .sql. Verifica que esté en C:/xampp/garcar_db.sql");
    connection.end();
}