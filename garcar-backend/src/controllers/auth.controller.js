const pool = require('../config/database');
const jwt = require('jsonwebtoken'); // <-- 1. Importamos la librería JWT

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE username = ? AND password = ?', 
            [username, password]
        );

        if (rows.length > 0) {
            const user = rows[0];

            // <-- 2. CREAMOS EL TOKEN -->
            // Metemos el ID y nombre en el token, lo firmamos con el secreto y le damos 8 horas de vida
            const token = jwt.sign(
                { id: user.id_usuario, nombre: user.nombre_completo, role: 'admin' }, 
                process.env.JWT_SECRET, 
                { expiresIn: '8h' } 
            );

            // <-- 3. ENVIAMOS EL TOKEN AL FRONTEND -->
            res.json({ 
                auth: true, 
                token: token, // Esta es la llave que el frontend deberá guardar
                user: { id: user.id_usuario, nombre: user.nombre_completo } 
            });
        } else {
            res.status(401).json({ auth: false, message: "Credenciales incorrectas" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
};

module.exports = { login };