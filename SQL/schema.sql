-- CREATE DATABASE prueba_tecnica; -- Ejecutar por separado

-- Tabla de bodegas
CREATE TABLE IF NOT EXISTS bodegas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de sucursales
CREATE TABLE IF NOT EXISTS sucursales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    bodega_id INTEGER NOT NULL,
    FOREIGN KEY (bodega_id) REFERENCES bodegas(id)
);

-- Tabla de monedas
CREATE TABLE IF NOT EXISTS monedas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de materiales
CREATE TABLE IF NOT EXISTS materiales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    bodega_id INTEGER NOT NULL,
    sucursal_id INTEGER NOT NULL,
    moneda_id INTEGER NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion TEXT NOT NULL,
    FOREIGN KEY (bodega_id) REFERENCES bodegas(id),
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id),
    FOREIGN KEY (moneda_id) REFERENCES monedas(id)
);

-- Tabla intersección producto_material
CREATE TABLE IF NOT EXISTS producto_material (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materiales(id),
    UNIQUE (producto_id, material_id)
);

-- Datos de ejemplo para bodegas
INSERT INTO bodegas (nombre) VALUES 
('Bodega Central'),
('Bodega Norte'),
('Bodega Sur');

-- Datos de ejemplo para sucursales
INSERT INTO sucursales (nombre, bodega_id) VALUES 
('Sucursal Centro', 1),
('Sucursal Plaza', 1),
('Sucursal Mall Norte', 2),
('Sucursal Outlet Norte', 2),
('Sucursal Sur 1', 3),
('Sucursal Sur 2', 3);

-- Datos de ejemplo para monedas
INSERT INTO monedas (nombre) VALUES 
('CLP'),
('DÓLAR'),
('EURO'),
('MXN');

-- Datos de ejemplo para materiales
INSERT INTO materiales (nombre) VALUES 
('Madera'),
('Metal'),
('Plástico'),
('Vidrio'),
('Textil');
