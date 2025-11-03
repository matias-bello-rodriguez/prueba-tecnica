<?php

class Database {
    
    private $host;
    private $database;
    private $username;
    private $password;
    private $port;
    private $conexion;

    public function __construct() {
        // Detectar si estamos en Render o local
        $isRender = getenv('RENDER') !== false || getenv('DB_HOST') !== false;
        
        $this->host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
        $this->username = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'postgres');
        $this->password = getenv('DB_PASSWORD') ?: ($_ENV['DB_PASSWORD'] ?? 'rayen123');
        $this->port = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? '5432');
        
        // Base de datos: usar la de Render si existe variable, sino la local
        if ($isRender && getenv('DB_NAME')) {
            $this->database = getenv('DB_NAME'); // prueba_tecnica_1644 en Render
        } else {
            $this->database = $_ENV['DB_NAME'] ?? 'prueba_tecnica'; // local
        }
        
        // Debug para verificar variables en Render (solo en desarrollo)
        if (getenv('DEBUG_MODE') === 'true') {
            error_log("Ambiente: " . ($isRender ? 'Render' : 'Local'));
            error_log("DB_HOST: " . $this->host);
            error_log("DB_NAME: " . $this->database);
            error_log("DB_USER: " . $this->username);
        }
    }

    public function getConnection() {
        $this->conexion = null;

        try {
            $dsn = "pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->database;
            $this->conexion = new PDO(
                $dsn,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch(PDOException $exception) {
            error_log("Error de conexión: " . $exception->getMessage());
            error_log("DSN usado: pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->database);
            throw new Exception("Error de conexión a la base de datos");
        }

        return $this->conexion;
    }
}

?>