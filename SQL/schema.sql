-- CREATE DATABASE prueba_tecnica; -- Ejecutar por separado

-- Tabla de bodegas
CREATE TABLE IF NOT EXISTS bodegas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de sucursales
CREATE TABLE IF NOT EXISTS sucursales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    bodega_id INTEGER NOT NULL,
    direccion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bodega_id) REFERENCES bodegas(id)
);

-- Tabla de monedas
CREATE TABLE IF NOT EXISTS monedas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    simbolo VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de materiales
CREATE TABLE IF NOT EXISTS materiales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bodega_id) REFERENCES bodegas(id),
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id),
    FOREIGN KEY (moneda_id) REFERENCES monedas(id)
);

-- Tabla intersección producto_material
CREATE TABLE IF NOT EXISTS producto_material (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materiales(id),
    UNIQUE (producto_id, material_id)
);

-- Datos de ejemplo para bodegas
INSERT INTO bodegas (nombre, direccion) VALUES 
('Bodega Central', 'Av. Principal 123'),
('Bodega Norte', 'Calle Norte 456'),
('Bodega Sur', 'Av. Sur 789');

-- Datos de ejemplo para sucursales
INSERT INTO sucursales (nombre, bodega_id, direccion) VALUES 
('Sucursal Centro', 1, 'Centro Comercial A'),
('Sucursal Plaza', 1, 'Plaza Principal'),
('Sucursal Mall Norte', 2, 'Mall del Norte'),
('Sucursal Outlet Norte', 2, 'Outlet Norte'),
('Sucursal Sur 1', 3, 'Centro Sur'),
('Sucursal Sur 2', 3, 'Mall del Sur');

-- Datos de ejemplo para monedas
INSERT INTO monedas (nombre, simbolo) VALUES 
('CLP', 'CLP'),
('DÓLAR', 'USD'),
('Euro', 'EUR'),
('Peso Argentino', 'ARS');

-- Datos de ejemplo para materiales
INSERT INTO materiales (nombre) VALUES 
('Madera'),
('Metal'),
('Plástico'),
('Vidrio');