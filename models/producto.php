<?php

require_once __DIR__ . '/../config/database.php';

class ProductoModelo{

    private $db;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
    }

    //función que verifica si el producto existe
    public function existeCodigoProducto($codigo){
        try{
            $stmt = $this->db->prepare("SELECT COUNT(*) FROM productos WHERE codigo = ?"); //la variable statement guarda la cantidad de productos existentes con el código dado, en esta línea la sentencia SQL es preparada para usarse multiples veces
            $stmt->execute([$codigo]); //se ejecuta la query, esta en forma de array, ya que puede obtener mas de un dato para ejecutar la query por cada parámetro $codigo que entre a la función
            return $stmt->fetchColumn() > 0; //dentro de $statement que ya es un objeto, se aplica la funcion fetch que obtiene los registros ya ejecutados, si al menos existe uno, devuelve true, de lo contrario, false
        } catch(PDOException $errorEjecucion){
            error_log("Error al verificar: " . $errorEjecucion->getMessage()); //obtenermos el error exacto desde el entorno de ejecución
            throw new Exception("Error al verificar el código"); //creamos un objeto exception
        }
    }

    //función que crea productos
    public function crearProducto($valores){
        try {
            if ($this->existeCodigoProducto($valores['codigo'])) {
                throw new Exception("Ya existe un producto con este código");
            }

            //A continuación haremos uso de una transacción, y ejecutaremos las funciones php como un bloque SQL, para asegurar unicidad. 
            //haremos uso de este recurso, ya que la operación INSERT manipula directamente la BD.

            // --1. inicio de la transaccion a BD
            $this->db->beginTransaction();

            // --2. insertar el producto (sin campo materiales, ahora usa tabla intersección)
            $sql = "INSERT INTO productos (codigo, nombre, bodega_id, sucursal_id, moneda_id, precio, descripcion, fecha_creacion) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, NOW()) RETURNING id"; //PostgreSQL usa RETURNING id en lugar de lastInsertId()
            
            $stmt = $this->db->prepare($sql);
            //la consulta se ejecuta,tomando los valores del array que recibirá, usando [] para conocer los valores
            $stmt->execute([
                $valores['codigo'],
                $valores['nombre'],
                $valores['bodega_id'],
                $valores['sucursal_id'],
                $valores['moneda_id'],
                $valores['precio'],
                $valores['descripcion']
            ]);

            $result = $stmt->fetch();
            $productoId = $result['id']; //toma el id del último registro de la BD insertado usando RETURNING

            // Inserta los materiales asociados al producto en la tabla producto_material(tabla intersección)
            if (!empty($valores['materiales'])) {
                $sqlMaterial = "INSERT INTO producto_material (producto_id, material_id) VALUES (?, ?)"; //inserta en producto_material la fk de producto y la fk de material
                $stmtMaterial = $this->db->prepare($sqlMaterial);
                //stmtMaterial tiene almacenada la query con sus valores

                //materiales es un array, ej: [1,2,3,4,5]
                //... materiales es recorrido por cada id de material, cada vez que se recorre, el insert de producto_material, con su valor de materialId, y la variable productoId que tiene el id del producto insertado previamente
                foreach ($valores['materiales'] as $materialId) {
                    $stmtMaterial->execute([$productoId, $materialId]);
                }
            }
            
            // --3. si sale bien y no hay excepciones, confirmamos la transaccion con un commit
            $this->db->commit();
            return $productoId; // devuelve el ID del producto creado

        } catch (PDOException $errorEjecucion) {
            // --4 si falla, revertimos la transaccion
            //al revertir la transacción, deshacemos los cambios hechos anteriormente para no guardarlos en la bd
            //EJ: si surge un error en la inserción de materiles, podemos deshacer la inserción de productos
            $this->db->rollBack();
            error_log("Error al crear producto: " . $errorEjecucion->getMessage());
            throw new Exception("Error al crear el producto: " . $errorEjecucion->getMessage());
        }
    }
    
    //función para obtener las bodegas, de manera de desplegarlos en dropdown menu
    public function obtenerBodegas(){
        try {
            $stmt = $this->db->query("SELECT id, nombre FROM bodegas ORDER BY nombre"); //se usa el query directamente porque no hay parámetros de entrada, todas las consultas se veran igual, es la razón por la cual no hay "prepare"
            return $stmt->fetchAll(PDO::FETCH_ASSOC); //se usa un fetchAll, que devuelve la constante de la clase PDO que devuelve una estructura para devolver la lista de filas en formato HashMap(key, value)
        } catch (PDOException $errorEjecucion) {
            error_log("Error al obtener bodegas: " . $errorEjecucion->getMessage());
            return []; //devuelve un array, ya que el interceptor de select espera mas de un valor
        }
    }

    //funcion para devolver elementos del select de forma dinámica, reaccionando a valor de bodega
    public function obtenerSucursalesPorBodega($bodegaId){
        try {
            $stmt = $this->db->prepare("SELECT id, nombre FROM sucursales WHERE bodega_id = ? ORDER BY nombre"); //la query devuelve todas las sucursales relacionadas con la bodega
            $stmt->execute([$bodegaId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);            
        } catch (PDOException $errorEjecucion) {
            error_log("Error al obtener sucursales: " . $errorEjecucion->getMessage());
            return [];
        }
    }

    //función para obtener todos los valores de monedas
    public function obtenerMonedas() {
        try {
            $stmt = $this->db->query("SELECT id, nombre FROM monedas ORDER BY nombre");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al obtener monedas: " . $e->getMessage());
            return [];
        }
    }

    //función para obtener todos los valores de materiales desde la BD
    public function obtenerMateriales() {
    try {
        $stmt = $this->db->query("
            SELECT id, nombre 
            FROM materiales 
            ORDER BY 
                CASE LOWER(nombre)
                    WHEN 'plastico' THEN 1
                    WHEN 'plástico' THEN 1
                    WHEN 'metal' THEN 2
                    WHEN 'madera' THEN 3
                    WHEN 'vidrio' THEN 4
                    WHEN 'textil' THEN 5
                    ELSE 6
                END,
                nombre
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("Error al obtener materiales: " . $e->getMessage());
        return [];
    }
    }

}

?>