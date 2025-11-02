<?php


require_once __DIR__ . '/../models/producto.php';

class ProductoController{

    private $model;  //declaramos la variable modelo

    public function __construct()
    {
        $this->model = new ProductoModelo();  //creamos una nueva instancia del modelo producto
    }

    //función para mostrar valores no dinámicos del formulario

    //función para mostrar valores no dinámicos del formulario
    public function mostrarDatosPorDefecto(){
        try {
            //hashmap que toma los valores que retornan las funciones de model 
            $data = [
                'bodegas' => $this->model->obtenerBodegas(),
                'monedas' => $this->model->obtenerMonedas(),
                'materiales' => $this->model->obtenerMateriales() //agregado para cargar materiales desde BD
            ];

            $this->cargarVista('formulario_producto', $data); //función para cargar datos en el formulario

        } catch (PDOException $errorEjecucion) {
            $this->enviarJson(false, "Error al cargar el formulario: " . $errorEjecucion->getMessage());
                }
    }

    //funcion para registrar producto
    public function registrarProducto(){
        try {

            // verifica si es una funcion ajax
            if(!$this->esAjax()){
                throw new Exception("Peticion no válida");
            }

            //Obtener datos del formulario
            $datos = $this->obtenerDatosFormulario();

            //Validamos los datos
            $errores = $this->validarDatos($datos);

            if(!empty($errores)){
                $this->enviarJson(false, implode(', ', $errores));
                return; //retorna nada, para terminar la ejecución del código
            }

            if ($this->model->existeCodigoProducto($datos['codigo'])) {
                $this->enviarJson(false, "el código del producto ya está registrado");
                return;
            }

            //si el método no entro a ningun if
            //crear producto

            $resultado = $this->model->crearProducto($datos);

            if ($resultado) {
                $this->enviarJson(true, "Producto registrado");
            } else {
                $this->enviarJson(false, "Error al registrar");
            }

            //la excepción en este caso, no es PDO, ya que no manejamos el modelo directamente, sino atrave      
        } catch (Exception $errorEjecucion) {
            error_log("Error en registrarProducto: " . $errorEjecucion->getMessage());
            $this->enviarJson(false, "Error interno del servidor");
        }
    }

    //obtiene sucursales por bodega 
    
    public function obtenerSucursales(){
        try {
            if (!$this->esAjax()) {
                throw new Exception("Petición no válida");
            }
            $bodegaId = filter_input(INPUT_POST, 'bodega_id', FILTER_VALIDATE_INT);//obtiene id por medio de la bodega del html
            if(!$bodegaId){
                $this->enviarJson(false, "Id de bodega, no válido");
                return;
            }

            $sucursales = $this->model->obtenerSucursalesPorBodega($bodegaId);
            $this->enviarJson(true,"Sucursales", $sucursales);


        } catch (Exception $errorEjecucion) {
            error_log("Error en obtenerSucursales: " . $errorEjecucion->getMessage());
            $this->enviarJson(false, "Error al obtener sucursales");            
            }
    }

    //obtiene los datos del formulario, y valida si tienen los tipos de datos correctos
    //obtiene los datos del formulario, y valida si tienen los tipos de datos correctos
    private function obtenerDatosFormulario() {
        $materiales = $_POST['materiales'] ?? [];

        // Procesar materiales como array de IDs (no strings) para tabla intersección
        $materialesLimpios = [];
        foreach ($materiales as $materialId) {
            $materialIdLimpio = filter_var($materialId, FILTER_VALIDATE_INT);
            if ($materialIdLimpio !== false && $materialIdLimpio > 0) {
                $materialesLimpios[] = $materialIdLimpio;
            }
        }

        return [
            'codigo' => htmlspecialchars(trim($_POST['codigo'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'nombre' => htmlspecialchars(trim($_POST['nombre'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'bodega_id' => filter_input(INPUT_POST, 'bodega_id', FILTER_VALIDATE_INT),
            'sucursal_id' => filter_input(INPUT_POST, 'sucursal_id', FILTER_VALIDATE_INT),
            'moneda_id' => filter_input(INPUT_POST, 'moneda_id', FILTER_VALIDATE_INT),
            'precio' => filter_input(INPUT_POST, 'precio', FILTER_VALIDATE_FLOAT),
            'descripcion' => htmlspecialchars(trim($_POST['descripcion'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'materiales' => $materialesLimpios, //array de IDs para tabla intersección
        ];
    }
 

    //se validan los datos
    private function validarDatos($datos){
        $errores = []; //los errores se guardan en formato de array

        if (empty($datos['codigo'])) {
            $errores[] = "El código es requerido";
        } elseif (strlen($datos['codigo']) > 50) {
            $errores[] = "El código no puede exceder 50 caracteres";
        }
        
        if (empty($datos['nombre'])) {
            $errores[] = "El nombre es requerido";
        } elseif (strlen($datos['nombre']) > 100) {
            $errores[] = "El nombre no puede exceder 100 caracteres";
        }
        
        if (!$datos['bodega_id']) {
            $errores[] = "Debe seleccionar una bodega";
        }
        
        if (!$datos['sucursal_id']) {
            $errores[] = "Debe seleccionar una sucursal";
        }
        
        if (!$datos['moneda_id']) {
            $errores[] = "Debe seleccionar una moneda";
        }
        
        if ($datos['precio'] === false || $datos['precio'] <= 0) {
            $errores[] = "El precio debe ser un número mayor a 0";
        }
        
        if (empty($datos['descripcion'])) {
            $errores[] = "La descripción es requerida";
        } elseif (strlen($datos['descripcion']) > 500) {
            $errores[] = "La descripción no puede exceder 500 caracteres";
        }
        
        if (empty($datos['materiales'])) {
            $errores[] = "Debe seleccionar al menos 2 materiales";
        } else if (count($datos['materiales']) < 2) {
            $errores[] = "Debe seleccionar al menos 2 materiales";
        }
        
        return $errores;        

    }

    //uso de petición AJAX
    private function esAjax() {
        return isset($_POST['ajax']) && $_POST['ajax'] === '1';
     //se usa POST ya que se actualiza y crea en la BD, ademas de razones de seguridad 
    }
        

    //enviar excepción usando formato JSON 
    private function enviarJson($success, $message, $data = null) {
        header('Content-Type: application/json; charset=utf-8'); //el header estipula la respuesta HTTP 
        $response = [
            'success' => $success,
            'message' => $message
        ]; //respuesta en forma de array
        
        if ($data !== null) {
            $response['data'] = $data;
        } //si hay datos adicional succes o message, se despliega la infromación adicional en la variable $data
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE); //la función transforma el array en un objeto JSON
        exit;
    }    

    //funcion para devolver datos a la vista 
    private function cargarVista($vista, $data = []) {
        extract($data);
        include __DIR__ . "/../views/{$vista}.php";
    }    

}

?>