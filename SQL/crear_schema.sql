--script para crear la base de datos
CREATE DATABASE registro_producto;
\c registro_producto;

CREATE TABLE bodega (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE sucursal (
    id SERIAL PRIMARY KEY,
    bodega_id INT REFERENCES bodega(id),
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE moneda (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL
);

CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(15) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    bodega_id INT REFERENCES bodega(id),
    sucursal_id INT REFERENCES sucursal(id),
    moneda_id INT REFERENCES moneda(id),
    precio NUMERIC(10,2) NOT NULL,
    descripcion TEXT NOT NULL
);

CREATE TABLE material(
    id SERIAL PRIMARY KEY, 
    nombre VARCHAR(8)
)

--tabla entidad relacion, debido a relacion muchos a muchos entre producto y material
CREATE TABLE producto_material(
    producto_id INT REFERENCES producto(id),
    material_id INT REFERENCES material(id),
    PRIMARY KEY(producto_id, material_id)
)

-- Datos de ejemplo
INSERT INTO bodega (nombre) VALUES ('Bodega Central'), ('Bodega Norte'), ('Bodega Sur');
INSERT INTO sucursal (bodega_id,nombre) VALUES (1,'Sucursal A'), (1,'Sucursal B'), (2,'Sucursal C'), (3, 'Sucursal D');
INSERT INTO moneda (nombre) VALUES ('CLP'), ('DÓLAR'), ('EURO');
INSERT INTO material (nombre) VALUES ('Plástico'), ('Metal'), ('Madera'), ('Vidrio'), ('Cuero'), ('Textil');
