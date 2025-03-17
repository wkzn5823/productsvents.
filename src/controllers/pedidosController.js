const db = require("../db");
const { logger } = require("../middlewares/logger"); // ✅ Importamos Winston

// 🔹 Crear un pedido
exports.createPedido = async (req, res) => {
    const client = await db.connect();

    try {
        if (!req.user || !req.user.id) {
            logger.warn("⚠️ Usuario no autenticado intentó crear un pedido");
            return res.status(401).json({ error: "No se pudo obtener el ID del usuario." });
        }

        const { total, productos } = req.body;
        const usuario_id = req.user.id;

        if (!productos || productos.length === 0) {
            logger.warn(`⚠️ Pedido inválido: Carrito vacío (Usuario ID: ${usuario_id})`);
            return res.status(400).json({ error: "El carrito está vacío." });
        }
        if (isNaN(total) || total <= 0) {
            logger.warn(`⚠️ Pedido inválido: Total inválido (${total}) por Usuario ID: ${usuario_id}`);
            return res.status(400).json({ error: "El total es inválido." });
        }

        await client.query("BEGIN");

        logger.info(`🛒 Creando pedido para Usuario ID: ${usuario_id}, Total: ${total}`);

        const pedidoResult = await client.query(
            "INSERT INTO pedidos (usuario_id, fecha, total, estado) VALUES ($1, NOW(), $2, 'pendiente') RETURNING id",
            [usuario_id, total]
        );
        const pedidoId = pedidoResult.rows[0].id;

        logger.info(`📦 Pedido creado con ID: ${pedidoId}`);

        const insertQueries = productos.map((producto) =>
            client.query(
                "INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)",
                [pedidoId, producto.producto_id, producto.cantidad, producto.precio_unitario]
            )
        );

        await Promise.all(insertQueries);
        await client.query("COMMIT");

        logger.info(`✅ Pedido ID: ${pedidoId} creado exitosamente para Usuario ID: ${usuario_id}`);
        res.status(201).json({ message: "Pedido creado exitosamente", pedidoId });
    } catch (error) {
        await client.query("ROLLBACK");
        logger.error(`❌ Error al crear pedido: ${error.message}`);
        res.status(500).json({ error: "Error al procesar el pedido" });
    } finally {
        client.release();
    }
};

// 🔹 Obtener todos los pedidos
exports.getPedidos = async (req, res) => {
    try {
        logger.info(`📋 Obteniendo pedidos para Usuario ID: ${req.user.id}`);

        const pedidos = req.user.role_id === 1
            ? await db.query(`
                SELECT p.*, u.nombre AS usuario_nombre, u.email AS usuario_email, 
                       TO_CHAR(p.fecha, 'YYYY-MM-DD') AS fecha
                FROM pedidos p
                JOIN usuarios u ON p.usuario_id = u.id
                WHERE p.estado = 'pendiente'`)
            : await db.query(`
                SELECT p.*, u.nombre AS usuario_nombre, u.email AS usuario_email, 
                       TO_CHAR(p.fecha, 'YYYY-MM-DD') AS fecha
                FROM pedidos p
                JOIN usuarios u ON p.usuario_id = u.id
                WHERE p.usuario_id = $1 AND p.estado = 'pendiente'`, [req.user.id]);

        logger.info(`✅ Se encontraron ${pedidos.rows.length} pedidos para Usuario ID: ${req.user.id}`);
        res.json({ success: true, pedidos: pedidos.rows });
    } catch (error) {
        logger.error(`❌ Error al obtener pedidos: ${error.message}`);
        res.status(500).json({ error: "Error al obtener los pedidos" });
    }
};

// 🔹 Obtener un pedido por ID
exports.getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            logger.warn(`⚠️ ID inválido para pedido: ${id}`);
            return res.status(400).json({ error: "El ID del pedido debe ser un número válido." });
        }

        logger.info(`🔍 Buscando pedido con ID: ${id}`);

        const result = await db.query("SELECT * FROM pedidos WHERE id = $1 AND estado = $2", [id, "pendiente"]);
        if (result.rows.length === 0) {
            logger.warn(`⚠️ Pedido con ID ${id} no encontrado o ya deshabilitado`);
            return res.status(404).json({ error: "Pedido no encontrado o ya deshabilitado" });
        }

        logger.info(`✅ Pedido encontrado: ${JSON.stringify(result.rows[0])}`);
        res.json(result.rows[0]);
    } catch (error) {
        logger.error(`❌ Error al obtener el pedido: ${error.message}`);
        res.status(500).json({ error: "Error al obtener el pedido" });
    }
};

// 🔹 Obtener los detalles de un pedido
exports.getDetallesPedido = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            logger.warn(`⚠️ ID inválido para detalles de pedido: ${id}`);
            return res.status(400).json({ error: "El ID del pedido debe ser un número válido." });
        }

        logger.info(`🔍 Buscando detalles del pedido con ID: ${id}`);

        const result = await db.query(`
            SELECT pd.id, pd.pedido_id, p.nombre AS producto, pd.cantidad, pd.precio_unitario, pd.subtotal
            FROM pedido_detalles pd
            JOIN productos p ON pd.producto_id = p.id
            WHERE pd.pedido_id = $1`, [id]);

        logger.info(`✅ Se encontraron ${result.rows.length} detalles para el pedido ID: ${id}`);
        res.json(result.rows);
    } catch (error) {
        logger.error(`❌ Error al obtener los detalles del pedido: ${error.message}`);
        res.status(500).json({ error: "Error al obtener los detalles del pedido" });
    }
};
