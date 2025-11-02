# Conectar a PostgreSQL como superusuario
sudo -u postgres psql

# O si tienes usuario configurado:
psql -U postgres

# Ejecutar el script
\i /home/matias/prueba-tecnica/SQL/crear_schema_corregido.sql

# Salir
\q