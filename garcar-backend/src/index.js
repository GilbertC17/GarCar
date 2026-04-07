const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// --- IMPORTACIÓN DE RUTAS ---
const productRoutes = require('./routes/products.routes');
const authRoutes = require('./routes/auth.routes');
const configRoutes = require('./routes/config.routes');
const fs = require('fs');

// Si la carpeta uploads no existe, la crea automáticamente en la raíz
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

const app = express();

// --- MIDDLEWARES ---
// ¡CORS siempre va primero! Vital para que React pueda pedir las imágenes sin que lo bloqueen
app.use(cors()); 

// Permite que el servidor entienda los datos en formato JSON
app.use(express.json());

// 🔓 LA LLAVE MÁGICA CORREGIDA: Apunta exactamente a la carpeta "uploads" de la raíz
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// --- REGISTRO DE RUTAS (API ENDPOINTS) ---
// Rutas para productos (Catálogo y Admin)
app.use('/api', productRoutes);

// Rutas para autenticación (Login)
app.use('/api/auth', authRoutes);

app.use('/api', configRoutes);

// --- CONFIGURACIÓN DEL SERVIDOR ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 Servidor de GarCar corriendo en puerto ${PORT}`);
    console.log(`✅ Base de datos conectada correctamente`);
    console.log(`==========================================`);
});