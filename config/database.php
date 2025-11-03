<?php

class Database {
    
    private $host;
    private $database;
    private $username;
    private $password;
    private $conexion;

    public function __construct() {
        $this->host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'localhost';
        $this->database = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'prueba_tecnica';
        $this->username = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'postgres';
        $this->password = $_ENV['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?: 'rayen123';
    }

    public function getConnection() {
        $this->conexion = null;

        try {
            $this->conexion = new PDO(
                "pgsql:host=" . $this->host . ";dbname=" . $this->database,
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
            throw new Exception("Error de conexión a la base de datos");
        }

        return $this->conexion;
    }
}

?>