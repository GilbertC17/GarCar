const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Buscamos el token en la cabecera de la petición
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ error: 'Acceso denegado: No se proporcionó un token.' });
    }

    try {
        // 2. El formato suele ser "Bearer token12345", así que lo separamos
        const token = authHeader.split(' ')[1];
        
        // 3. Verificamos que el token sea auténtico y no haya caducado
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Guardamos los datos del usuario en la petición y lo dejamos pasar
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Acceso denegado: Token inválido o expirado.' });
    }
};

module.exports = verifyToken;