const db = require('../db');

// 🔹 Función para crear un pedido
exports.createPedido = async (req, res) => {
    const client = await db.connect();

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "No se pudo obtener el ID del usuario." });
        }

        const { total, productos } = req.body;
        const usuario_id = req.user.id;

        // Validación de productos y total
        if (!productos || productos.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío." });
        }
        if (isNaN(total) || total <= 0) {
            return res.status(400).json({ error: "El total es inválido." });
        }

        // Validación adicional de los productos (asegurarse de que tenga los datos correctos)
        for (let producto of productos) {
            if (!producto.producto_id || !producto.cantidad || !producto.precio_unitario) {
                return res.status(400).json({ error: "Cada producto debe tener un 'producto_id', 'cantidad' y 'precio_unitario'." });
            }
            if (isNaN(producto.cantidad) || producto.cantidad <= 0) {
                return res.status(400).json({ error: "La cantidad de cada producto debe ser un número positivo." });
            }
            if (isNaN(producto.precio_unitario) || producto.precio_unitario <= 0) {
                return res.status(400).json({ error: "El precio unitario debe ser un número positivo." });
            }
        }

        await client.query("BEGIN");  // Comienza la transacción

        // Insertar el pedido
        const pedidoResult = await client.query(
            "INSERT INTO pedidos (usuario_id, fecha, total, estado) VALUES ($1, NOW(), $2, 'pendiente') RETURNING id",
            [usuario_id, total]  // Parametrización para evitar inyecciones SQL
        );
        const pedidoId = pedidoResult.rows[0].id;

        // Insertar los productos en pedido_detalles
        const insertQueries = productos.map(producto => {
            return client.query(
                "INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)",
                [pedidoId, producto.producto_id, producto.cantidad, producto.precio_unitario]  // Parametrización de la consulta
            );
        });
        await Promise.all(insertQueries);  // Ejecutar todas las consultas de inserción

        await client.query("COMMIT");  // Confirmamos la transacción si todo ha salido bien
        res.status(201).json({ message: "Pedido creado exitosamente", pedidoId });
    } catch (error) {
        await client.query("ROLLBACK");  // Si hubo un error, revertimos la transacción
        res.status(500).json({ error: "Error al procesar el pedido" });
    } finally {
        client.release();  // Liberamos la conexión
    }
};

// 🔹 Función para obtener todos los pedidos
exports.getPedidos = async (req, res) => {
    try {
        // Si el usuario es un admin, obtiene todos los pedidos
        const pedidos = req.user.role_id === 1 
            ? await db.query(`
                SELECT p.*, 
                       u.nombre AS usuario_nombre, 
                       u.email AS usuario_email, 
                       TO_CHAR(p.fecha, 'YYYY-MM-DD') AS fecha
                FROM pedidos p
                JOIN usuarios u ON p.usuario_id = u.id
                WHERE p.estado = 'pendiente'`  // Asumimos que el estado "pendiente" significa que el pedido está activo
            ): await db.query(`
                SELECT p.*, 
                       u.nombre AS usuario_nombre, 
                       u.email AS usuario_email, 
                       TO_CHAR(p.fecha, 'YYYY-MM-DD') AS fecha
                FROM pedidos p
                JOIN usuarios u ON p.usuario_id = u.id
                WHERE p.usuario_id = $1 AND p.estado = 'pendiente'`, [req.user.id]);  // Solo los pedidos pendientes del usuario

        res.json({ success: true, pedidos: pedidos.rows });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los pedidos" });
    }
};

// 🔹 Función para obtener un pedido por ID
exports.getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el ID del pedido sea un número válido
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID del pedido debe ser un número válido." });
        }

        // Consultar el pedido por ID
        const result = await db.query('SELECT * FROM pedidos WHERE id = $1 AND estado = $2', [id, 'pendiente']);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado o ya deshabilitado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
};

// 🔹 Función para obtener los detalles de un pedido
exports.getDetallesPedido = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el ID del pedido sea un número válido
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID del pedido debe ser un número válido." });
        }

        // Consultar los detalles del pedido
        const result = await db.query(`
            SELECT pd.id, pd.pedido_id, p.nombre AS producto, pd.cantidad, pd.precio_unitario, pd.subtotal
            FROM pedido_detalles pd
            JOIN productos p ON pd.producto_id = p.id
            WHERE pd.pedido_id = $1`, [id]);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles del pedido' });
    }
};
