const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Importamos 'fs' para manejar carpetas
const { getProductos, updatePrecio, addProducto, updateEstado, editProducto } = require('../controllers/products.controller');

// --- 1. IMPORTAMOS EL MIDDLEWARE DE SEGURIDAD (EL CADENERO) ---
const verifyToken = require('../middlewares/auth.middleware');

// --- 2. GARANTIZAMOS QUE LA CARPETA EXISTA EN RENDER ---
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// --- Configuración de Multer (Dónde y cómo guardar el archivo) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });


// ==========================================
// RUTAS PÚBLICAS (Cualquiera puede verlas)
// ==========================================
router.get('/productos', getProductos);


// ==========================================
// RUTAS PROTEGIDAS (Solo ADMIN con token válido)
// ==========================================

// Actualizar precio
router.put('/productos/:id', verifyToken, updatePrecio);

// Añadir nuevo producto (El cadenero revisa primero, si pasa, multer sube la foto)
router.post('/productos', verifyToken, upload.single('imagen'), addProducto); 

// Cambiar estado (Activo/Agotado/Inactivo)
router.put('/productos/:id/estado', verifyToken, updateEstado); 

// Editar producto completo con foto
router.put('/productos/:id/editar', verifyToken, upload.single('imagen'), editProducto);

module.exports = router;