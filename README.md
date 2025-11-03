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

#### **Windows 11**
1. Descargar PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Ejecutar el instalador y seguir el asistente
3. Anotar la contraseña del usuario `postgres`
4. Descargar PHP desde: https://www.php.net/downloads.php
5. Asegurar que la extensión `pgsql` esté habilitada en `php.ini`

### 3. Configurar PostgreSQL

#### Crear usuario y base de datos:

```bash
# Conectar como superusuario postgres
sudo -u postgres psql

# Dentro de PostgreSQL:
CREATE DATABASE prueba_tecnica;
CREATE USER tu_usuario WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE prueba_tecnica TO tu_usuario;
\q
```

### 4. Ejecutar el Schema de Base de Datos

```bash
# Conectar a PostgreSQL
psql -U tu_usuario -d prueba_tecnica

# Ejecutar el script
\i /ruta/completa/al/proyecto/SQL/schema.sql

# Salir
\q
```

**Alternativa desde terminal:**
```bash
psql -U tu_usuario -d prueba_tecnica -f SQL/schema.sql
```

### 5. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

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
# - Cambiar DB_PASSWORD por tu contraseña
# - Verificar que DB_HOST y DB_PORT sean correctos
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

### 8. Ejecutar el Proyecto

#### Servidor PHP Built-in (Recomendado para desarrollo):
```bash
cd /ruta/al/proyecto
php -S localhost:8015
```

#### Con Apache/Nginx:
- Configurar virtual host apuntando a la carpeta del proyecto
- Asegurar que `index.php` sea el archivo de entrada

### 9. Acceder a la Aplicación

Abrir navegador en: `http://localhost:8015`

## 🔧 Verificación de Instalación

### Verificar PostgreSQL:
```bash
psql -U tu_usuario -d prueba_tecnica -c "SELECT * FROM materiales;"
```

### Verificar PHP Extensions:
```bash
php -m | grep pgsql
```

### Verificar Datos de Prueba:
```sql
-- Conectar a la BD y ejecutar:
SELECT 'Bodegas:' as tabla, count(*) as registros FROM bodegas
UNION ALL
SELECT 'Sucursales:', count(*) FROM sucursales  
UNION ALL
SELECT 'Monedas:', count(*) FROM monedas
UNION ALL
SELECT 'Materiales:', count(*) FROM materiales;
```

## 📁 Estructura del Proyecto

```
prueba-tecnica/
├── config/
│   └── database.php          # Configuración de BD
├── controllers/
│   └── producto.php          # Controlador principal
├── models/
│   └── producto.php          # Modelo de datos
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

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL:
1. Verificar que PostgreSQL esté corriendo: `sudo systemctl status postgresql`
2. Verificar credenciales en `config/database.php`
3. Verificar que el usuario tenga permisos en la BD

### Error 500 en PHP:
1. Verificar logs: `tail -f /var/log/apache2/error.log`
2. Verificar extensiones PHP: `php -m | grep pgsql`
3. Verificar permisos de archivos

### JavaScript no funciona:
1. Verificar que el navegador soporte ES6 modules
2. Abrir Developer Tools para ver errores en consola
3. Verificar que los archivos JS estén en las rutas correctas

## 📝 Notas Adicionales

- El proyecto usa **ES6 modules**, requiere navegadores modernos
- Para **producción**, configurar un servidor web apropiado
- Los **logs de PHP** se guardan según la configuración del servidor
- La aplicación usa **transacciones PostgreSQL** para integridad de datos