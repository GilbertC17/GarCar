const pool = require('../config/database');

const getProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE activo = TRUE');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

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

const addProducto = async (req, res) => {
    const { nombre, categoria, precio, unidad_medida, rango_peso, descripcion, precio_menudeo, precio_mayoreo, rango_menudeo, rango_mayoreo } = req.body;
    const imagen_url = req.file ? `https://garcar-api.onrender.com/uploads/${req.file.filename}` : null;

    // Convertimos textos vacíos a null para que MySQL no marque error
    const pMen = precio_menudeo === '' ? null : precio_menudeo;
    const pMay = precio_mayoreo === '' ? null : precio_mayoreo;

    try {
        const [result] = await pool.query(
            `INSERT INTO productos (nombre, categoria, precio, unidad_medida, rango_peso, descripcion, imagen_url, precio_menudeo, precio_mayoreo, rango_menudeo, rango_mayoreo) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, categoria, precio, unidad_medida, rango_peso, descripcion, imagen_url, pMen, pMay, rango_menudeo || null, rango_mayoreo || null]
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
    const { nombre, categoria, precio, unidad_medida, rango_peso, descripcion, precio_menudeo, precio_mayoreo, rango_menudeo, rango_mayoreo } = req.body;
    
    const pMen = precio_menudeo === '' ? null : precio_menudeo;
    const pMay = precio_mayoreo === '' ? null : precio_mayoreo;

    try {
        if (req.file) {
            const imagen_url = `https://garcar-api.onrender.com/uploads/${req.file.filename}`;
            await pool.query(
                `UPDATE productos SET nombre=?, categoria=?, precio=?, unidad_medida=?, rango_peso=?, descripcion=?, imagen_url=?, precio_menudeo=?, precio_mayoreo=?, rango_menudeo=?, rango_mayoreo=? WHERE id_producto=?`,
                [nombre, categoria, precio, unidad_medida, rango_peso, descripcion, imagen_url, pMen, pMay, rango_menudeo || null, rango_mayoreo || null, id]
            );
        } else {
            await pool.query(
                `UPDATE productos SET nombre=?, categoria=?, precio=?, unidad_medida=?, rango_peso=?, descripcion=?, precio_menudeo=?, precio_mayoreo=?, rango_menudeo=?, rango_mayoreo=? WHERE id_producto=?`,
                [nombre, categoria, precio, unidad_medida, rango_peso, descripcion, pMen, pMay, rango_menudeo || null, rango_mayoreo || null, id]
            );
        }
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

module.exports = { getProductos, updatePrecio, addProducto, updateEstado, editProducto };