# Conectar a PostgreSQL como superusuario
sudo -u postgres psql

# O si tienes usuario configurado:
psql -U postgres

# Ejecutar el script
\i /home/matias/prueba-tecnica/SQL/crear_schema_corregido.sql

# Salir
\q


# instalar diver postgresql para php

# Para Ubuntu/Debian
sudo apt update
sudo apt install php-pgsql

# Para CentOS/RHEL
sudo yum install php-pgsql
# o
sudo dnf install php-pgsql

# Reiniciar Apache si lo usas
sudo service apache2 restart

# Verificar que se instaló
php -m | grep pgsql