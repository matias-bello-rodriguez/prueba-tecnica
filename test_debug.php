<?php
// filepath: /home/matias/prueba-tecnica/test_debug.php
echo "<h1>Diagnóstico de Errores</h1>";

echo "<h2>1. Verificar archivos:</h2>";
$archivos = [
    'conexion.php',
    'controllers/producto.php', 
    'models/producto.php',
    'views/formulario_producto.php'
];

foreach ($archivos as $archivo) {
    if (file_exists(__DIR__ . '/' . $archivo)) {
        echo "<p>✅ $archivo existe</p>";
    } else {
        echo "<p>❌ $archivo NO EXISTE</p>";
    }
}

echo "<h2>2. Probar conexión a BD:</h2>";
try {
    require_once 'conexion.php';
    $db = DataBase::getInstance();
    $pdo = $db->getConnection();
    echo "<p>✅ Conexión a BD correcta</p>";
    
    // Probar datos
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM bodega");
    $result = $stmt->fetch();
    echo "<p>📦 Bodegas en BD: {$result['total']}</p>";
    
} catch (Exception $e) {
    echo "<p>❌ Error de BD: " . $e->getMessage() . "</p>";
}

echo "<h2>3. Probar controlador:</h2>";
try {
    require_once 'controllers/producto.php';
    $controller = new ProductoController();
    echo "<p>✅ Controlador se carga correctamente</p>";
} catch (Exception $e) {
    echo "<p>❌ Error en controlador: " . $e->getMessage() . "</p>";
}
?>