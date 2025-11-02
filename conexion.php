<?php

//Definimos la clase de la base de datos

class DataBase {

    private static $instance = null;   //atributo  de clase, se inicializa con null
    private $connection; //atributo que contendrá la instancia de ejecución

    private const CONFIG = [        //atributo constante que configura la BD
        'host' => 'localhost',
        'port' => '5432',
        'dbname' => 'registro_producto',  //nombre de la BD
        'username' => 'root', //usuario de la BD
        'password' => 'rayen123', //contraseña de la BD
        'charset' => 'utf8mb4', //conjunto de caracteres para soportar distintos idiomas y special characters
    ];

    private function __construct(){   //constructor vacío
        $this->connect(); //el statement llama a connect
    }                     //el método es private de la instancia de clase DataBase

    
    private function connect(){  //metodo que conecta a al BD
            try{
                $dsn = sprintf("pgsql:host=%s;port=%s,dbname=%s",  //construye pdo(php data object) 
                self::CONFIG['host'],  //estas 3 lineas, llaman a la variables de clase CONFIG
                self::CONFIG['port'],
                self::CONFIG['dbname']
            );

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, //retorna errores         
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, //transforma en arrays sentencias fetch()
                PDO::ATTR_EMULATE_PREPARES => false, 
                PDO::ATTR_PERSISTENT => false  //no usa conexión persistente
            ];            

            $this->connection = new PDO(     //crea un objeto con PDO
                $dsn,
                self::CONFIG['username'],
                self::CONFIG['password'],
                $options
            );

            // Configurar charset con sentencia SQL
            $this->connection->exec("SET NAMES " . self::CONFIG['charset']);
            
            
            }
            //se lanza exception
            catch(PDOException $e){
                error_log("Error al conectar a la BD: " . $e->getMessage());
                throw new Exception("Error de conexión a la base de datos");
            }
        }

    public static function getInstance() { //asegura que haya una sola instancia para toda la app
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }


    //retorna el objeto PDO, osea la instancia de la clase de la conexión para ser usada fuera de la clase
    public function getConnection() {
        return $this->connection;
    }
    
    // protege la instancia de no ser singleton
    private function __clone() {}
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }


            

}

?>