# Gestión de Productos

<p align="center">
  <img src="https://github.com/user-attachments/assets/d081d555-d5f8-48bb-940c-164606a487c2"  alt="Gestión de productos 1" width="45%" />
  <img src="https://github.com/user-attachments/assets/759a220d-1ff5-4dea-817c-aaf8c07cc2a6" alt="Gestión de productos 2" width="45%">
</p>


Aplicación web para registro de productos con formulario dinámico.

## Requisitos

- PHP 8.0+
- PostgreSQL 12+
- Navegador web moderno

## Instalación

### 1. Clonar proyecto

```bash
git clone https://github.com/matias-bello-rodriguez/prueba-tecnica.git
cd prueba-tecnica
```

### 2. Configurar PostgreSQL

#### Ubuntu/Debian
```bash
sudo apt install postgresql postgresql-contrib php-pgsql
sudo systemctl start postgresql
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
