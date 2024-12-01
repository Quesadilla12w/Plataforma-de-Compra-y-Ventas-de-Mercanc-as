const sql = require("mssql");

const dbConfig = {
    server: "QUESADILLA\\SQLEXPRESS", // Reemplaza con tu servidor
    database: "VideojuegosDB", // Nombre de tu base de datos
    user: "testUser", // Usuario SQL
    password: "SecurePassword123", // Contraseña del usuario
    options: {
        encrypt: true, // En true si necesitas encriptación
        trustServerCertificate: true // Acepta certificados no confiables
    }
};

// Función para establecer la conexión
const connectToDatabase = async () => {
    try {
        console.log("Intentando conectar a la base de datos...");
        const pool = await sql.connect(dbConfig);
        console.log("¡Conexión exitosa a la base de datos!");
        return pool; // Retorna la conexión para usarla en consultas
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
};

module.exports = connectToDatabase;