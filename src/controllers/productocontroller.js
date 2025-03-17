const db = require("../db");
const { logger } = require("../middlewares/logger"); // ✅ Importamos Winston

// 🔹 Obtener productos con opción de filtrado por categoría
exports.getProductos = async (req, res) => {
    try {
        const { categoria_id } = req.query;
        let query = `
            SELECT productos.id, productos.nombre, productos.descripcion, productos.precio, 
                   productos.stock, productos.imagen_url, productos.categoria_id, 
                   categorias.nombre AS categoria
            FROM productos
            JOIN categorias ON productos.categoria_id = categorias.id
        `;
        let values = [];

        if (categoria_id) {
            if (isNaN(categoria_id)) {
                logger.warn(`⚠️ Consulta rechazada: categoria_id inválido (${categoria_id})`);
                return res.status(400).json({ error: "El parámetro categoria_id debe ser un número válido." });
            }
            query += " WHERE productos.categoria_id = $1";
            values.push(categoria_id);
        }

        const { rows } = await db.query(query, values);
        logger.info(`✅ Productos obtenidos (${rows.length} resultados)`);
        return res.status(200).json(rows);
    } catch (error) {
        logger.error(`❌ Error al obtener productos: ${error.message}`);
        return res.status(500).json({ error: "Error al obtener los productos" });
    }
};

// 🔹 Obtener un producto por ID
exports.getProductoById = async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            logger.warn(`⚠️ ID inválido en getProductoById: ${id}`);
            return res.status(400).json({ error: "El ID del producto debe ser un número válido." });
        }

        const query = "SELECT * FROM productos WHERE id = $1";
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            logger.warn(`⚠️ Producto no encontrado con ID: ${id}`);
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        logger.info(`✅ Producto obtenido: ${rows[0].nombre} (ID: ${id})`);
        return res.status(200).json(rows[0]);
    } catch (error) {
        logger.error(`❌ Error en getProductoById: ${error.message}`);
        return res.status(500).json({ error: "Error en el servidor" });
    }
};

// 🔹 Agregar un nuevo producto
exports.addProducto = async (req, res) => {
    const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = req.body;

    if (!nombre || !descripcion || !precio || !stock || !categoria_id || !imagen_url) {
        logger.warn("⚠️ Intento de agregar producto con datos incompletos");
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (isNaN(precio) || precio <= 0 || isNaN(stock) || stock < 0) {
        logger.warn("⚠️ Precio o stock inválidos en addProducto");
        return res.status(400).json({ error: "Precio y stock deben ser valores numéricos positivos" });
    }

    try {
        const categoria = await db.query("SELECT * FROM categorias WHERE id = $1", [categoria_id]);
        if (categoria.rowCount === 0) {
            logger.warn(`⚠️ Intento de agregar producto con categoría inexistente (ID: ${categoria_id})`);
            return res.status(400).json({ error: "La categoría no existe" });
        }

        const { rows } = await db.query(
            `INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen_url) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombre, descripcion, precio, stock, categoria_id, imagen_url]
        );

        logger.info(`✅ Producto agregado: ${nombre} (ID: ${rows[0].id})`);
        return res.status(201).json({ success: true, producto: rows[0] });
    } catch (error) {
        logger.error(`❌ Error en addProducto: ${error.message}`);
        return res.status(500).json({ error: "Error al agregar producto" });
    }
};

// 🔹 Actualizar un producto
exports.updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = req.body;

        if (isNaN(id)) {
            logger.warn(`⚠️ ID inválido en updateProducto: ${id}`);
            return res.status(400).json({ error: "El ID del producto debe ser un número válido." });
        }

        if (!nombre || !descripcion || !precio || !stock || !categoria_id || !imagen_url) {
            logger.warn(`⚠️ Intento de actualización con datos incompletos (Producto ID: ${id})`);
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        if (isNaN(precio) || precio <= 0 || isNaN(stock) || stock < 0) {
            logger.warn("⚠️ Precio o stock inválidos en updateProducto");
            return res.status(400).json({ error: "Precio y stock deben ser valores numéricos positivos" });
        }

        const { rowCount } = await db.query(
            `UPDATE productos 
             SET nombre = $1, descripcion = $2, precio = $3, stock = $4, categoria_id = $5, imagen_url = $6
             WHERE id = $7 RETURNING *`,
            [nombre, descripcion, precio, stock, categoria_id, imagen_url, id]
        );

        if (rowCount === 0) {
            logger.warn(`⚠️ Producto no encontrado en updateProducto (ID: ${id})`);
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        logger.info(`✅ Producto actualizado (ID: ${id})`);
        res.json({ success: true, message: "Producto actualizado correctamente" });
    } catch (error) {
        logger.error(`❌ Error en updateProducto: ${error.message}`);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
};

// 🔹 Eliminar un producto
exports.deleteProducto = async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            logger.warn(`⚠️ ID inválido en deleteProducto: ${id}`);
            return res.status(400).json({ error: "El ID del producto debe ser un número válido." });
        }

        const { rowCount } = await db.query("DELETE FROM productos WHERE id = $1", [id]);

        if (rowCount === 0) {
            logger.warn(`⚠️ Intento de eliminar producto inexistente (ID: ${id})`);
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        logger.info(`✅ Producto eliminado (ID: ${id})`);
        return res.status(200).json({ success: true, message: "Producto eliminado" });
    } catch (error) {
        logger.error(`❌ Error en deleteProducto: ${error.message}`);
        return res.status(500).json({ error: "Error al eliminar producto" });
    }
};
