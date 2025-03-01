const db = require('../db');

// 🔹 Función para obtener todas las categorías
exports.getCategorias = async (req, res) => { 
    try { 
        // Consultamos solo las categorías activas (usamos TRUE explícitamente)
        const result = await db.query('SELECT * FROM categorias WHERE activo = $1', [true]);  // Compara con TRUE
        res.json(result.rows); 
    } catch (error) { 
        // No debemos exponer el error completo al cliente
        console.error("Error al obtener categorías:", error); 
        res.status(500).json({ error: 'Error al obtener categorías' }); 
    } 
};

// 🔹 Función para obtener una categoría por ID
exports.getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificamos que la categoría exista y esté activa
        const result = await db.query('SELECT * FROM categorias WHERE id = $1 AND activo = $2', [id, true]); 
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada o ya deshabilitada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener la categoría:", error);
        res.status(500).json({ error: 'Error al obtener la categoría' });
    }
};

// 🔹 Función para crear una nueva categoría
exports.createCategoria = async (req, res) => {
    const { nombre } = req.body;

    // Validamos que el nombre no esté vacío
    if (!nombre) {
        return res.status(400).json({ error: "El nombre de la categoría es obligatorio." });
    }

    try {
        // Insertamos la nueva categoría y asignamos 'TRUE' como valor predeterminado para 'activo'
        const newCategoria = await db.query(
            'INSERT INTO categorias (nombre, activo) VALUES ($1, $2) RETURNING *',  // Usamos TRUE para indicar que la categoría está activa por defecto
            [nombre, true]
        );

        return res.status(201).json(newCategoria.rows[0]);
    } catch (error) {
        console.error("Error al crear la categoría:", error);
        return res.status(500).json({ error: "Error al crear la categoría." });
    }
};

// 🔹 Función para actualizar una categoría
exports.updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        // Validamos que el nombre esté presente
        if (!nombre) {
            return res.status(400).json({ error: "El nombre de la categoría es obligatorio." });
        }

        // Solo actualizamos si la categoría está activa
        const result = await db.query('UPDATE categorias SET nombre = $1 WHERE id = $2 AND activo = $3', [nombre, id, true]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada o ya deshabilitada' });
        }

        res.json({ message: 'Categoría actualizada exitosamente' });
    } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
};

// 🔹 Función para deshabilitar una categoría (soft delete)
exports.deleteCategoria = async (req, res) => { 
    try { 
        const { id } = req.params; 
        
        // Verificar si la categoría existe antes de deshabilitarla
        const categoriaCheck = await db.query('SELECT * FROM categorias WHERE id = $1 AND activo = $2', [id, true]);

        if (categoriaCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada o ya deshabilitada' });
        }

        // Soft delete: cambiamos el estado 'activo' a FALSE
        await db.query('UPDATE categorias SET activo = $1 WHERE id = $2', [false, id]);

        res.json({ message: 'Categoría deshabilitada correctamente' });

    } catch (error) { 
        console.error("Error al deshabilitar la categoría:", error);
        res.status(500).json({ error: 'Error al deshabilitar la categoría' }); 
    } 
};
