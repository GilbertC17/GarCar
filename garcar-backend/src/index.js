const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// --- IMPORTACIÓN DE RUTAS ---
const productRoutes = require('./routes/products.routes');
const authRoutes = require('./routes/auth.routes');
const configRoutes = require('./routes/config.routes');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// --- MIDDLEWARES ---
// CORS es vital para que React (puerto 3000) pueda hablar con Node (puerto 3001)
app.use(cors()); 

// Permite que el servidor entienda los datos en formato JSON que enviamos desde el Frontend
app.use(express.json());

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