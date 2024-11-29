-- Crear la base de datos
CREATE DATABASE VideojuegosDB;
-- GO

-- Seleccionar la base de datos para trabajar
USE VideojuegosDB;
GO

-- Tabla Usuarios
-- Almacena información de los usuarios registrados en el sistema.
-- Los usuarios pueden tener roles de "comprador" o "vendedor".
CREATE TABLE Usuarios (
    Id INT PRIMARY KEY IDENTITY(1,1), -- Identificador único de cada usuario.
    Nombre NVARCHAR(100) NOT NULL, -- Nombre del usuario.
    Email NVARCHAR(255) NOT NULL UNIQUE, -- Correo electrónico único para cada usuario.
    Password NVARCHAR(255) NOT NULL, -- Contraseña (debe estar hasheada en un sistema real).
    Rol NVARCHAR(50) NOT NULL CHECK (Rol IN ('comprador', 'vendedor')), -- Rol del usuario.
    FechaCreacion DATETIME DEFAULT GETDATE() -- Fecha de creación del registro.
);

-- Tabla Productos
-- Almacena información de los productos (videojuegos) ofrecidos en la plataforma.
CREATE TABLE Productos (
    Id INT PRIMARY KEY IDENTITY(1,1), -- Identificador único del producto.
    Nombre NVARCHAR(255) NOT NULL, -- Nombre del producto.
    Descripcion NVARCHAR(MAX), -- Descripción del producto.
    Precio DECIMAL(10, 2) NOT NULL, -- Precio unitario del producto.
    Stock INT NOT NULL CHECK (Stock >= 0), -- Cantidad disponible en inventario.
    Imagen NVARCHAR(255), -- Ruta o nombre del archivo de imagen asociado al producto.
    VendedorId INT NOT NULL, -- Identificador del usuario que publica el producto (vendedor).
    FechaCreacion DATETIME DEFAULT GETDATE(), -- Fecha de creación del registro.
    FOREIGN KEY (VendedorId) REFERENCES Usuarios(Id) -- Relación con la tabla Usuarios.
);

-- Tabla Carritos
-- Representa los carritos de compras de los usuarios.
CREATE TABLE Carritos (
    Id INT PRIMARY KEY IDENTITY(1,1), -- Identificador único del carrito.
    UsuarioId INT NOT NULL, -- Identificador del usuario al que pertenece el carrito.
    Total DECIMAL(10, 2) DEFAULT 0, -- Total acumulado en el carrito.
    FechaActualizacion DATETIME DEFAULT GETDATE(), -- Fecha de la última actualización del carrito.
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) -- Relación con la tabla Usuarios.
);

-- Tabla CarritoProductos
-- Almacena los productos añadidos a cada carrito, con su cantidad y precio unitario.
CREATE TABLE CarritoProductos (
    Id INT PRIMARY KEY IDENTITY(1,1), -- Identificador único de la relación carrito-producto.
    CarritoId INT NOT NULL, -- Identificador del carrito al que pertenece el producto.
    ProductoId INT NOT NULL, -- Identificador del producto en el carrito.
    Cantidad INT NOT NULL CHECK (Cantidad > 0), -- Cantidad de unidades del producto.
    Precio DECIMAL(10, 2) NOT NULL, -- Precio unitario del producto al momento de añadirlo.
    Subtotal AS (Cantidad * Precio) PERSISTED, -- Total calculado del producto (cantidad x precio).
    FOREIGN KEY (CarritoId) REFERENCES Carritos(Id), -- Relación con la tabla Carritos.
    FOREIGN KEY (ProductoId) REFERENCES Productos(Id) -- Relación con la tabla Productos.
);

-- Tabla Transacciones
-- Registra las compras realizadas por los usuarios.
CREATE TABLE Transacciones (
    Id INT PRIMARY KEY IDENTITY(1,1), -- Identificador único de la transacción.
    UsuarioId INT NOT NULL, -- Identificador del usuario que realiza la compra.
    Total DECIMAL(10, 2) NOT NULL, -- Total de la transacción.
    FechaTransaccion DATETIME DEFAULT GETDATE(), -- Fecha y hora de la transacción.
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) -- Relación con la tabla Usuarios.
);

-- Tabla TransaccionProductos
-- Detalla los productos comprados en cada transacción.
CREATE TABLE TransaccionProductos (
    Id INT PRIMARY KEY IDENTITY(1,1), -- Identificador único del producto en la transacción.
    TransaccionId INT NOT NULL, -- Identificador de la transacción a la que pertenece el producto.
    ProductoId INT NOT NULL, -- Identificador del producto comprado.
    Cantidad INT NOT NULL CHECK (Cantidad > 0), -- Cantidad comprada del producto.
    Precio DECIMAL(10, 2) NOT NULL, -- Precio unitario del producto al momento de la compra.
    Subtotal AS (Cantidad * Precio) PERSISTED, -- Total calculado del producto (cantidad x precio).
    FOREIGN KEY (TransaccionId) REFERENCES Transacciones(Id), -- Relación con la tabla Transacciones.
    FOREIGN KEY (ProductoId) REFERENCES Productos(Id) -- Relación con la tabla Productos.
);

GO
