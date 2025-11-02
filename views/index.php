<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario</title>
    <!-- importar styles.css -->
    <link rel="stylesheet" href="css/styles.css"> 
</head>
<body>
    <!-- contenedor del formulario -->
    <div class="container">
        <h1>Registro de Productos</h1>
        <!-- formulario -->
        <form action="formulario_producto">
            <label for="codigo">Código del producto</label>
            <input type="text" id="codigo" name="codigo" pattern="[A-Za-z0-9]+" minlength="5" maxlength="15" placeholder="EJ: Set comedor" required> <!-- pattern estipula atributos que aceptan expresiones regulares (REGEX), aqui de A-Z y solo números; tambien minlength y maxlength que establecen una cantidad mínima y máxima de caracteres -->

            <!-- nombre del producto -->
            <label for="nombre">Nombre del Producto:</label>
            <input type="text" id="nombre_id" name="nombre" minlength="2" maxlength="50" placeholder="EJ: PRODO1K" required>
            
            <!-- select de bodega -->
            <label for="bodega">Bodega:</label>
            <select id="bodega_id" name="bodega" required>
                <option value="">--Seleccione--</option>  <!-- se define el valor vacio -->
                <!-- se realiza un stmt php para recorrer la bodega y establecer una opcion select por cada ciclo -->
                <?php foreach($bodegas as $b): ?>
                    <option value="<?= htmlspecialchars($b['id']) ?>"><?= htmlspecialchars($b['nombre']) ?></option>
                <?php endforeach; ?>
            </select>
            
            <!-- sucursal depende de la opción de bodega seleccionada -->
            <label for="sucursal">Sucursal:</label>
            <select id="sucursal_id" name="sucursal" required>
                <option value="">--Seleccione--</option>
            </select>

            <!-- select de monedas -->
            <label for="moneda">Moneda:</label>
            <select id="moneda_id" name="moneda" required>
                <option value="">--Seleccione--</option>
                <!-- se realiza un stmt php para recorrer monedas y establecer una opcion select por cada ciclo -->
                <?php foreach($monedas as $m): ?>
                    <option value="<?= htmlspecialchars($m['id']) ?>"><?= htmlspecialchars($m['nombre']) ?></option>
                <?php endforeach; ?>
            </select>
            
            <label for="precio">Precio:</label>
            <input type="number" id="precio_id" name="precio" step="0.01" min="0.01" required> <!-- step permite dos decimales y un salto de una centena; min establece que el valor mínimo es 0.01, es decir, no permite 0 ni números negativos-->

            <!-- se establece un orden distinto, de manera que los labels/inputs puedan estar organizados como checkbox de forma horizontal -->
            <fieldset>
                <legend>Material del Producto:</legend>
                <label><input type="checkbox" name="material[]" value="Madera"> Madera</label>
                <label><input type="checkbox" name="material[]" value="Metal"> Metal</label>
                <label><input type="checkbox" name="material[]" value="Plástico"> Plástico</label>
                <label><input type="checkbox" name="material[]" value="Vidrio"> Vidrio</label>
            </fieldset>

            <!-- descripcion del producto -->
            <label for="descripcion">Descripción del Producto:</label>
            <textarea id="descripcion_id" name="descripcion" rows="5" required></textarea>

            <!-- guardar el producto -->
            <button type="button" id="guardarProducto">Guardar Producto</button>

        </form>
    </div>

    <!-- etiqueta script para hacer referencia a index.js -->
    <script src=js/index.js></script> 

</body>
</html>
