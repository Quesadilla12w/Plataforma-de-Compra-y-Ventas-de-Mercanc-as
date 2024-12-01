const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
const dbConfig = {
    server: "QUESADILLA\\SQLEXPRESS",
    database: "VideojuegosDB",
    user: "testUser",
    password: "SecurePassword123",
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

// Conexión a la base de datos
async function connectToDatabase() {
    try {
        await sql.connect(dbConfig);
        console.log("Conexión exitosa a la base de datos");
    } catch (err) {
        console.error("Error al conectar a la base de datos:", err);
    }
}
connectToDatabase();

// Rutas para usuarios
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .input("email", sql.NVarChar, email)
            .input("password", sql.NVarChar, password)
            .query("SELECT Id, Nombre, Email, Rol FROM Usuarios WHERE Email = @email AND Password = @password");

        if (result.recordset.length > 0) {
            res.status(200).json({ user: result.recordset[0] });
        } else {
            res.status(401).json({ message: "Credenciales incorrectas" });
        }
    } catch (err) {
        console.error("Error al iniciar sesión:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});


// Endpoint para obtener productos
app.get("/productos", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM Productos");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// Endpoint para agregar productos
app.post("/productos", async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;

        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("nombre", sql.NVarChar, nombre)
            .input("descripcion", sql.NVarChar, descripcion)
            .input("precio", sql.Decimal(10, 2), precio)
            .input("stock", sql.Int, stock)
            .input("categoria", sql.NVarChar, categoria)
            .input("imagen", sql.NVarChar, imagen) // Se guarda como una URL
            .query(
                "INSERT INTO Productos (Nombre, Descripcion, Precio, Stock, Categoria, Imagen) VALUES (@nombre, @descripcion, @precio, @stock, @categoria, @imagen)"
            );

        res.status(201).json({ message: "Producto agregado correctamente" });
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Error al agregar producto" });
    }
});

// Endpoint para eliminar productos
app.delete("/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await sql.query(`DELETE FROM Productos WHERE Id = ${id}`);
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Error al eliminar producto" });
    }
});

app.put("/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;

        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("id", sql.Int, id)
            .input("nombre", sql.NVarChar, nombre)
            .input("descripcion", sql.NVarChar, descripcion)
            .input("precio", sql.Decimal(10, 2), precio)
            .input("stock", sql.Int, stock)
            .input("categoria", sql.NVarChar, categoria)
            .input("imagen", sql.NVarChar, imagen)
            .query(
                "UPDATE Productos SET Nombre = @nombre, Descripcion = @descripcion, Precio = @precio, Stock = @stock, Categoria = @categoria, Imagen = @imagen WHERE Id = @id"
            );

        res.status(200).json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error al actualizar producto" });
    }
});

app.get("/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM Productos WHERE Id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ error: "Error al obtener producto" });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});









