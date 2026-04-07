const pool = require('../config/database');

// Obtener toda la configuración del sitio
const getConfig = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM configuracion');
        // Convertimos el array de filas en un objeto fácil de usar en React
        // ej: { hero_headline: '...', hero_image_url: '...' }
        const configMap = rows.reduce((acc, row) => {
            acc[row.clave] = row.valor;
            return acc;
        }, {});
        res.json(configMap);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la configuración' });
    }
};

// Actualizar textos y/o imagen del Home
const updateHomeConfig = async (req, res) => {
    const { hero_headline, hero_subheadline } = req.body;
    
    try {
        // 1. Actualizamos los textos (Headline y Subheadline)
        await pool.query('UPDATE configuracion SET valor = ? WHERE clave = ?', [hero_headline, 'hero_headline']);
        await pool.query('UPDATE configuracion SET valor = ? WHERE clave = ?', [hero_subheadline, 'hero_subheadline']);

        // 2. Si se subió una nueva imagen, actualizamos la URL
        if (req.file) {
            const newImageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
            await pool.query('UPDATE configuracion SET valor = ? WHERE clave = ?', [newImageUrl, 'hero_image_url']);
        }

        res.json({ message: 'Home actualizado exitosamente ✅' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el Home' });
    }
};

module.exports = { getConfig, updateHomeConfig };