--CREATE DATABASE VideojuegosDB;
--GO

USE VideojuegosDB;
GO

CREATE TABLE Usuarios (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL, -- Hasheada en un sistema real
    Rol NVARCHAR(50) NOT NULL CHECK (Rol IN ('comprador', 'vendedor')),
    FechaCreacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE Productos (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(255) NOT NULL,
    Descripcion NVARCHAR(MAX),
    Precio DECIMAL(10, 2) NOT NULL,
    Stock INT NOT NULL CHECK (Stock >= 0),
    Imagen NVARCHAR(255), -- Ruta al archivo de imagen
    VendedorId INT NOT NULL,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (VendedorId) REFERENCES Usuarios(Id)
);

CREATE TABLE Carritos (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NOT NULL,
    Total DECIMAL(10, 2) DEFAULT 0,
    FechaActualizacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id)
);

CREATE TABLE CarritoProductos (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CarritoId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL CHECK (Cantidad > 0),
    Precio DECIMAL(10, 2) NOT NULL, -- Precio unitario al momento de agregar
    Subtotal AS (Cantidad * Precio) PERSISTED, -- Campo calculado
    FOREIGN KEY (CarritoId) REFERENCES Carritos(Id),
    FOREIGN KEY (ProductoId) REFERENCES Productos(Id)
);

CREATE TABLE Transacciones (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NOT NULL,
    Total DECIMAL(10, 2) NOT NULL,
    FechaTransaccion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id)
);

CREATE TABLE TransaccionProductos (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TransaccionId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL CHECK (Cantidad > 0),
    Precio DECIMAL(10, 2) NOT NULL, -- Precio unitario al momento de la compra
    Subtotal AS (Cantidad * Precio) PERSISTED, -- Campo calculado
    FOREIGN KEY (TransaccionId) REFERENCES Transacciones(Id),
    FOREIGN KEY (ProductoId) REFERENCES Productos(Id)
);

GO