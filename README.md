# Proyecto Gestión de Productos

Sistema de gestión de productos con formulario dinámico usando PHP, PostgreSQL y JavaScript modular.

## 📋 Requisitos del Sistema

- PHP 8.0 o superior
- PostgreSQL 12 o superior
- Servidor web (Apache/Nginx) o PHP built-in server
- Git

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd prueba-tecnica
```

### 2. Instalar PostgreSQL

#### **Ubuntu/Debian**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib php-pgsql
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### **Fedora/CentOS/RHEL**
```bash
# Fedora
sudo dnf install postgresql postgresql-server php-pgsql
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# CentOS/RHEL
sudo yum install postgresql postgresql-server php-pgsql
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### **macOS**
```bash
# Usando Homebrew
brew install postgresql php
brew services start postgresql

# Instalar extensión PHP PostgreSQL
brew install php@8.2-pgsql  # o la versión de PHP que uses
```

#### Windows 11
1. Descargar PostgreSQL: https://www.postgresql.org/download/windows/
2. Instalar siguiendo el asistente
3. Anotar contraseña del usuario `postgres`
4. Instalar PHP: https://www.php.net/downloads.php
5. Habilitar extensión `pgsql` en `php.ini`

### 3. Base de datos

```bash
# Conectar a PostgreSQL
sudo -u postgres psql

# Crear base de datos
CREATE DATABASE prueba_tecnica;
CREATE USER tu_usuario WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE prueba_tecnica TO tu_usuario;
\q
```

### 4. Importar schema

```bash
psql -U tu_usuario -d prueba_tecnica -f SQL/schema.sql
```

### 5. Configuración

Crear `.env` basado en `.env.example`:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_NAME=prueba_tecnica
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_PORT=5432

# Configuración del Servidor
SERVER_PORT=8015
DEBUG_MODE=false

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

## Funcionalidades

- Registro de productos con validación
- Selección dinámica bodega/sucursal
- Múltiples materiales por producto
- Formulario responsive
- Validación cliente y servidor

## Problemas comunes

**Error de conexión PostgreSQL:**
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

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
├── views/
│   └── formulario_producto.php  # Vista del formulario
├── js/
│   ├── index.js             # Controlador JS principal
│   └── modules/             # Módulos JavaScript
├── css/
│   └── styles.css           # Estilos
├── SQL/
│   └── schema.sql           # Schema de la base de datos
├── .env                     # Variables de entorno (crear)
└── index.php               # Punto de entrada
```
