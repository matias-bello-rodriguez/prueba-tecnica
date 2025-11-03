FROM php:8.2-cli

# Instalar extensiones PHP necesarias para PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY . .

# Exponer el puerto que usará Render
EXPOSE $PORT

# Comando para iniciar el servidor PHP
CMD php -S 0.0.0.0:$PORT