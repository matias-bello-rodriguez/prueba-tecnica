<?php

require_once __DIR__ . '/controllers/producto.php';

try {
    $controller = new ProductoController(); //objeto de producto controller

        // transformar accion en peticion
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['ajax'])) { //se asegura el uso de POST y AJAX
        $action = $_POST['action'] ?? 'registrar_producto'; //verifica si la peticion tiene una accion  post de accion distinta de registrar_producto
        
        switch ($action) {
            case 'registrar_producto':
                $controller->registrarProducto();
                break;
                
            case 'obtener_sucursales':
                $controller->obtenerSucursales();
                break;
                
            default:
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Acción no válida']);
                break;
        }
    } else {
        // Mostrar formulario
        $controller->mostrarDatosPorDefecto();
    }

} catch (Exception $e) {
    error_log("Error en index.php: " . $e->getMessage());
    
    if (isset($_POST['ajax'])) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
    } else {
        echo "<h1>Error</h1><p>Ha ocurrido un error. Por favor, intente más tarde.</p>";
    }
}

?>