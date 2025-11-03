# Sistema de Registro de Productos

Sistema web para registro y gestión de productos desarrollado según especificaciones técnicas de prueba de diagnóstico.

## Descripción del Proyecto

Sistema de registro de productos que permite validar y guardar datos del formulario en base de datos PostgreSQL. Desarrollado con tecnologías nativas según requerimientos técnicos específicos.

## Tecnologías Utilizadas

- **HTML**: Estructuras estándar para interfaz de usuario
- **CSS**: Estilos nativos sin frameworks (sin Bootstrap ni Tailwind)
- **PHP**: Desarrollo backend sin frameworks
- **JavaScript**: Funciones nativas y AJAX para conectividad
- **PostgreSQL**: Gestor de base de datos

## Versiones Requeridas

- **PHP**: 8.2 o superior
- **PostgreSQL**: 12 o superior
- **Navegador**: Moderno con soporte ES6

## Pasos para Instalar el Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/matias-bello-rodriguez/prueba-tecnica.git
cd prueba-tecnica
```

### 2. Configurar el Servidor Web

#### Para Ubuntu/Debian:
```bash
sudo apt update
sudo apt install apache2 php8.2 php8.2-pgsql postgresql postgresql-contrib
sudo systemctl start apache2
sudo systemctl enable apache2
```

#### Para Fedora/RHEL:
```bash
sudo dnf install httpd php php-pgsql postgresql postgresql-server
sudo systemctl start httpd
sudo systemctl enable httpd
```

#### Para macOS (con Homebrew):
```bash
# Usando Homebrew
brew install postgresql php
brew services start postgresql
```

#### Para Windows:
1. Descargar PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Instalar siguiendo el asistente de instalación
3. Anotar la contraseña del usuario `postgres`
4. Descargar PHP desde: https://www.php.net/downloads.php
5. Habilitar extensión `pgsql` en el archivo `php.ini`

### 3. Configurar PostgreSQL

```bash
# Conectar a PostgreSQL como usuario postgres
sudo -u postgres psql

# Crear base de datos y usuario
CREATE DATABASE prueba_tecnica;
CREATE USER prueba_user WITH PASSWORD 'prueba123';
GRANT ALL PRIVILEGES ON DATABASE prueba_tecnica TO prueba_user;
\q
```

### 4. Importar Esquema de Base de Datos

```bash
# Desde el directorio del proyecto
psql -U prueba_user -d prueba_tecnica -f SQL/schema.sql
```

### 5. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_NAME=prueba_tecnica
DB_USER=prueba_user
DB_PASSWORD=prueba123
DB_PORT=5432
```

### 6. Configurar Servidor Web

#### Opción A: Servidor PHP Integrado (Desarrollo)
```bash
# Desde el directorio del proyecto
php -S localhost:8000
```

#### Opción B: Apache (Producción)
```bash
# Copiar proyecto a directorio web
sudo cp -r . /var/www/html/prueba-tecnica
sudo chown -R www-data:www-data /var/www/html/prueba-tecnica
```

### 7. Acceder a la Aplicación

Abrir navegador web y visitar:
- Servidor PHP: `http://localhost:8000`
- Apache: `http://localhost/prueba-tecnica`

## Estructura del Proyecto

```
prueba-tecnica/
├── index.php                    # Página principal
├── routing.php                  # Enrutador de la aplicación
├── config/
│   └── database.php            # Configuración de base de datos
├── controllers/
│   └── producto.php            # Controlador de productos
├── models/
│   └── producto.php            # Modelo de productos
├── views/
│   └── formulario_producto.php # Vista del formulario
├── css/
│   └── styles.css              # Estilos CSS nativos
├── js/
│   ├── index.js                # JavaScript principal
│   └── modules/                # Módulos ES6
│       ├── validators/
│       │   └── ProductoValidator.js
│       ├── services/
│       │   └── ProductoService.js
│       └── utils/
│           ├── FormUtils.js
│           └── UIUtils.js
├── SQL/
│   └── schema.sql              # Esquema de base de datos
├── validators/
└── exceptions/
```

## Características Implementadas

### Formulario de Registro
- **Código del Producto**: Validación obligatoria, formato específico (5-15 caracteres, letras y números), verificación de unicidad
- **Nombre del Producto**: Obligatorio, 2-50 caracteres
- **Bodega**: Select dinámico cargado desde base de datos
- **Sucursal**: Select dependiente de bodega seleccionada
- **Moneda**: Select cargado desde base de datos
- **Precio**: Validación de número positivo con hasta 2 decimales
- **Material**: Checkboxes con mínimo 2 selecciones requeridas
- **Descripción**: Textarea obligatoria, 10-1000 caracteres

### Validaciones JavaScript
- Validaciones en tiempo real sin atributo `required` de HTML
- Mensajes de error personalizados con `alert()`
- Expresiones regulares para formato de código y precio
- Validación de selección múltiple en materiales

### Tecnología AJAX
- Envío de formulario sin recarga de página
- Carga dinámica de sucursales según bodega
- Verificación de unicidad de código de producto
- Manejo de errores y respuestas del servidor

### Estilos CSS Nativos
- Fuente: Arial, sans-serif, 16px
- Botón "Guardar Producto": Color #1aab8a, tamaño 16px
- Sin frameworks CSS (Bootstrap, Tailwind, etc.)
- Diseño responsivo y funcional

## Base de Datos

### Tablas Principales
- `productos`: Almacena información de productos
- `bodegas`: Catálogo de bodegas
- `sucursales`: Sucursales por bodega
- `monedas`: Tipos de moneda
- `materiales`: Materiales disponibles
- `producto_materiales`: Relación muchos a muchos

### Versión de Base de Datos
- **PostgreSQL**: 12 o superior
- **Extensiones**: pgcrypto (para generación de UUIDs)

## Información de Contacto

Para cualquier consulta sobre el proyecto:

- **Desarrollador**: Matias Bello Rodriguez
- **GitHub**: https://github.com/matias-bello-rodriguez/prueba-tecnica
- **Repositorio**: Proyecto de prueba técnica

## Notas Técnicas

- Proyecto desarrollado sin frameworks para cumplir especificaciones técnicas
- Validaciones implementadas completamente en JavaScript nativo
- Base de datos diseñada con relaciones normalizadas
- Código modular con separación de responsabilidades
- Compatible con despliegue en Render.com

# IMPORTANTE: 
# - Cambiar DB_USER por tu usuario de PostgreSQL
```

Editar valores en `config/database.php`:

```php
private $username = 'tu_usuario';    // cambiar aquí
private $password = 'tu_password';   // cambiar aquí
```

### 6. Iniciar servidor

```bash
php -S localhost:8015
```

Abrir http://localhost:8015 en el navegador.
```

**⚠️ IMPORTANTE:** Debes modificar las siguientes variables:
- `DB_USER`: Tu usuario de PostgreSQL
- `DB_PASSWORD`: Tu contraseña de PostgreSQL  
- `DB_HOST`: Si usas un servidor remoto, cambiar por la IP/dominio
- `DB_PORT`: Si PostgreSQL usa un puerto diferente al 5432

### 6. Configurar la Conexión en el Código

Editar `config/database.php` con tus credenciales:

```php
<?php
class Database {
    private $host = 'localhost';           // Cambiar si es necesario
    private $database = 'prueba_tecnica';  
    private $username = 'tu_usuario';      // ⚠️ CAMBIAR AQUÍ
    private $password = 'tu_password';     // ⚠️ CAMBIAR AQUÍ
    // ... resto del código
}
?>
```

### 7. Instalar Dependencias PHP

#### **Ubuntu/Debian**
```bash
sudo apt install php-pgsql php-json php-mbstring
sudo service apache2 restart  # Si usas Apache
```

#### **Fedora/CentOS**
```bash
sudo dnf install php-pgsql php-json php-mbstring
sudo systemctl restart httpd  # Si usas Apache
```

#### **macOS**
```bash
# Las extensiones ya vienen con Homebrew PHP
php -m | grep pgsql  # Verificar que esté instalado
```

#### **Windows**
Editar `php.ini` y descomentar:
```ini
extension=pdo_pgsql
extension=pgsql
extension=json
extension=mbstring
```

Abrir http://localhost:8015 en el navegador.

## Estructura del proyecto

```
├── config/database.php      # Conexión BD
├── controllers/producto.php # Lógica del formulario
├── models/producto.php      # Modelo de datos
├── views/formulario_producto.php # Vista del form
├── js/                      # JavaScript modular
│   ├── index.js            # Controlador principal
│   └── modules/            # Módulos ES6
├── css/styles.css          # Estilos
├── SQL/schema.sql          # Base de datos
└── routing.php             # Rutas
```

## Problemas comunes

**Error de conexión PostgreSQL:**
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verificar permisos de usuario
# Verificar permisos de usuario
sudo -u postgres psql -c "\du"
```

**PHP no encuentra extensión pgsql:**
```bash
# Ubuntu/Debian
sudo apt install php-pgsql
sudo service apache2 restart

# Verificar
php -m | grep pgsql
```

## Deployment en Render

### 1. Preparar archivos

El proyecto incluye:
- `Dockerfile` - Para deployment con Docker
- `composer.json` - Configuración PHP optimizada
- `.dockerignore` - Optimización del build

### 2. Pasos en Render

1. **Crear cuenta** en render.com
2. **Crear base de datos**:
   - New → PostgreSQL
   - Nombre: `prueba-tecnica-db`
   - Guardar todas las credenciales

3. **Importar schema**:
   ```bash
   psql "postgresql://user:pass@host:port/db" < SQL/schema.sql
   ```

4. **Crear web service**:
   - New → Web Service
   - Conectar: `https://github.com/matias-bello-rodriguez/prueba-tecnica`
   - Environment: **Docker**
   - Auto-deploy: **Yes**

5. **Variables de entorno**:
   ```
   DB_HOST=<render-db-host>
   DB_NAME=prueba_tecnica
   DB_USER=<render-db-user>
   DB_PASSWORD=<render-db-password>
   DB_PORT=5432
   ```

### 3. Resultado

Tu aplicación estará disponible en: `https://tu-app.onrender.com`

El Dockerfile se encarga automáticamente de:
- Instalar PHP 8.2 con extensiones PostgreSQL
- Configurar el servidor para puerto dinámico
- Optimizar el contenedor para producción
```

**PHP no encuentra extensión pgsql:**
```bash
# Ubuntu/Debian
sudo apt install php-pgsql
sudo service apache2 restart

# Verificar
php -m | grep pgsql
