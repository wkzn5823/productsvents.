const db = require('../db');

// 🔹 Función para obtener productos con opción de filtrado por categoría
exports.getProductos = async (req, res) => {
    try {
        const { categoria_id } = req.query; // Obtener el parámetro de la URL
        let query = `
            SELECT productos.id, productos.nombre, productos.descripcion, productos.precio, 
                   productos.stock, productos.imagen_url, productos.categoria_id, 
                   categorias.nombre AS categoria
            FROM productos
            JOIN categorias ON productos.categoria_id = categorias.id
        `;
        let values = [];

        // Filtrar por categoría si se envía el parámetro
        if (categoria_id) {
            if (isNaN(categoria_id)) {
                return res.status(400).json({ error: "El parámetro categoria_id debe ser un número válido." });
            }
            query += ' WHERE productos.categoria_id = $1';
            values.push(categoria_id);
        }

        const { rows } = await db.query(query, values);
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// 🔹 Función para obtener un producto por ID
exports.getProductoById = async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID del producto debe ser un número válido." });
        }

        const query = 'SELECT * FROM productos WHERE id = $1';
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.status(200).json(rows[0]); // Devuelve el producto encontrado
    } catch (error) {
        return res.status(500).json({ error: 'Error en el servidor' });
    }
};

// 🔹 Función para agregar un nuevo producto
exports.addProducto = async (req, res) => {
    const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = req.body;

    // 🔹 Validar que todos los campos estén presentes
    if (!nombre || !descripcion || !precio || !stock || !categoria_id || !imagen_url) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // 🔹 Validación del precio y stock
    if (isNaN(precio) || precio <= 0) {
        return res.status(400).json({ error: "El precio debe ser un número positivo." });
    }
    if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ error: "El stock debe ser un número no negativo." });
    }

    try {
        // 🔹 Verificar si la categoría existe antes de insertar el producto
        const categoria = await db.query("SELECT * FROM categorias WHERE id = $1", [categoria_id]);
        if (categoria.rowCount === 0) {
            return res.status(400).json({ error: "La categoría no existe" });
        }

        const { rows } = await db.query(
            `INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen_url) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombre, descripcion, precio, stock, categoria_id, imagen_url]
        );

        return res.status(201).json({ success: true, producto: rows[0] });

    } catch (error) {
        console.error(error.message);  // Solo registramos el error en el servidor
        return res.status(500).json({ error: 'Error al agregar producto' });
    }
};

// 🔹 Función para actualizar un producto
exports.updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID del producto debe ser un número válido." });
        }

        // Validación de los campos
        if (!nombre || !descripcion || !precio || !stock || !categoria_id || !imagen_url) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Validación del precio y stock
        if (isNaN(precio) || precio <= 0) {
            return res.status(400).json({ error: "El precio debe ser un número positivo." });
        }
        if (isNaN(stock) || stock < 0) {
            return res.status(400).json({ error: "El stock debe ser un número no negativo." });
        }

        const { rowCount } = await db.query(
            `UPDATE productos 
             SET nombre = $1, descripcion = $2, precio = $3, stock = $4, categoria_id = $5, imagen_url = $6
             WHERE id = $7 RETURNING *`,
            [nombre, descripcion, precio, stock, categoria_id, imagen_url, id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ success: true, message: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// 🔹 Función para eliminar un producto
exports.deleteProducto = async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID del producto debe ser un número válido." });
        }

        await db.query('DELETE FROM productos WHERE id = $1', [id]);
        return res.status(200).json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error al eliminar producto' });
    }
};
