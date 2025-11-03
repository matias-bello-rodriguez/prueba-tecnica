<?php
// Archivo de debug para verificar variables de entorno en Render
// Acceder a: https://tu-app.onrender.com/debug.php

echo "<h1>Debug de Variables de Entorno</h1>";
echo "<h2>Variables de Base de Datos:</h2>";
echo "<ul>";
echo "<li>DB_HOST: " . (getenv('DB_HOST') ?: 'NO DEFINIDA') . "</li>";
echo "<li>DB_NAME: " . (getenv('DB_NAME') ?: 'NO DEFINIDA') . "</li>";
echo "<li>DB_USER: " . (getenv('DB_USER') ?: 'NO DEFINIDA') . "</li>";
echo "<li>DB_PASSWORD: " . (getenv('DB_PASSWORD') ? '***DEFINIDA***' : 'NO DEFINIDA') . "</li>";
echo "<li>DB_PORT: " . (getenv('DB_PORT') ?: 'NO DEFINIDA') . "</li>";
echo "</ul>";

echo "<h2>Todas las Variables de Entorno:</h2>";
echo "<pre>";
foreach ($_ENV as $key => $value) {
    if (strpos($key, 'DB_') === 0 || strpos($key, 'DATABASE_') === 0) {
        if (strpos($key, 'PASSWORD') !== false) {
            echo "$key=***OCULTA***\n";
        } else {
            echo "$key=$value\n";
        }
    }
}
echo "</pre>";

echo "<h2>Test de Conexión:</h2>";
try {
    $database = new Database();
    $db = $database->getConnection();
    echo "<p style='color: green;'>✅ Conexión exitosa a la base de datos!</p>";
    
    // Test simple
    $stmt = $db->query("SELECT version()");
    $version = $stmt->fetch();
    echo "<p>Versión de PostgreSQL: " . $version['version'] . "</p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error de conexión: " . $e->getMessage() . "</p>";
}

echo "<p><em>IMPORTANTE: Eliminar este archivo después del debugging</em></p>";
?>

<?php
require_once 'config/database.php';
?>