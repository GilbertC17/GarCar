const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Importamos 'fs' para manejar carpetas
const { getConfig, updateHomeConfig } = require('../controllers/config.controller');

// --- 1. IMPORTAMOS EL CADENERO (MIDDLEWARE DE SEGURIDAD) ---
const verifyToken = require('../middlewares/auth.middleware');

// --- 2. GARANTIZAMOS QUE LA CARPETA EXISTA EN RENDER ---
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Reutilizamos la lógica de Multer con la ruta absoluta segura
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `banner_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// ==========================================
// RUTA PÚBLICA (Cualquiera puede leer el Home)
// ==========================================
router.get('/config', getConfig);

// ==========================================
// RUTA PROTEGIDA (Solo Admin puede editar el Home)
// ==========================================
// 'verifyToken' revisa la llave; si es válida, 'upload.single' procesa la imagen
router.post('/config/home', verifyToken, upload.single('banner'), updateHomeConfig); 

module.exports = router;