<?php

class Database {
    
    private $host = 'localhost';
    private $database = 'prueba_tecnica';
    private $username = 'postgres';
    private $password = 'rayen123';
    private $conexion;

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