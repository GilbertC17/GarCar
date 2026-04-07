const pool = require('../config/database');

const getProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE activo = TRUE');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// Actualizar precio de un producto
const updatePrecio = async (req, res) => {
    const { id } = req.params;
    const { precio } = req.body;
    try {
        await pool.query('UPDATE productos SET precio = ? WHERE id_producto = ?', [precio, id]);
        res.json({ message: 'Precio actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el precio' });
    }
};

// Función para añadir un nuevo producto con imagen
const addProducto = async (req, res) => {
    // req.body trae los textos, req.file trae la imagen
    const { nombre, categoria, precio, unidad_medida, rango_peso, descripcion } = req.body;
    // Si se subió una imagen, creamos la URL para guardarla en la base de datos
    const imagen_url = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : null;

    try {
        const [result] = await pool.query(
            `INSERT INTO productos (nombre, categoria, precio, unidad_medida, rango_peso, descripcion, imagen_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, categoria, precio, unidad_medida, rango_peso, descripcion, imagen_url]
        );
        res.json({ message: 'Producto agregado exitosamente', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

const updateEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        await pool.query('UPDATE productos SET estado = ? WHERE id_producto = ?', [estado, id]);
        res.json({ message: `Producto marcado como ${estado}` });
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar estado' });
    }
};

const editProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, precio, unidad_medida, rango_peso, descripcion } = req.body;
    
    try {
        if (req.file) {
            // Si subió una foto nueva, actualizamos todo incluida la imagen_url
            const imagen_url = `http://localhost:3001/uploads/${req.file.filename}`;
            await pool.query(
                `UPDATE productos SET nombre=?, categoria=?, precio=?, unidad_medida=?, rango_peso=?, descripcion=?, imagen_url=? WHERE id_producto=?`,
                [nombre, categoria, precio, unidad_medida, rango_peso, descripcion, imagen_url, id]
            );
        } else {
            // Si NO subió foto, actualizamos todo menos la imagen
            await pool.query(
                `UPDATE productos SET nombre=?, categoria=?, precio=?, unidad_medida=?, rango_peso=?, descripcion=? WHERE id_producto=?`,
                [nombre, categoria, precio, unidad_medida, rango_peso, descripcion, id]
            );
        }
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

module.exports = { getProductos, updatePrecio, addProducto, updateEstado, editProducto };