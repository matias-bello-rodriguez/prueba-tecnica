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
    <!-- contenedor del contenido -->
    <div class="container">

        <header>
            <h1>Formulario de Producto</h1>
        </header>


        <!-- contenido principal -->
         <div class="contenido">

            <!-- formulario -->
             <form method="POST" novalidate>

            <div class="form-row">
                <!-- este div agrupa los labels e inputs -->
                <div class="form-group">
                    <label for="codigo">Código</label>
                    <input type="text" id="codigo" name="codigo" pattern="[A-Za-z0-9]+" minlength="5" maxlength="15" placeholder="Ej: PRODO1K" required> <!-- pattern estipula atributos que aceptan expresiones regulares (REGEX), aqui de A-Z y solo números; tambien minlength y maxlength que establecen una cantidad mínima y máxima de caracteres -->
                </div>

                <div class="form-group">
                    <!-- nombre del producto -->
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" minlength="2" maxlength="50" placeholder="Ej: Set comedor" required>
                </div>    
            </div>

            <div class="form-row">
                <div class="form-group">                  
                    <!-- select de bodega -->
                    <label for="bodega_id">Bodega:</label>
                    <select id="bodega" name="bodega_id" required>
                        <option value="">--Seleccione--</option>  <!-- placeholder con valor deshabilitado -->
                        <!-- se realiza un stmt php para recorrer la bodega y establecer una opcion select por cada ciclo -->
                        <?php foreach($bodegas as $b): ?>
                            <option value="<?= htmlspecialchars($b['id']) ?>"><?= htmlspecialchars($b['nombre']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
         
                <div class="form-group">                
                    <!-- sucursal depende de la opción de bodega seleccionada -->
                    <label for="sucursal_id">Sucursal:</label>
                    <select id="sucursal" name="sucursal_id" required disabled>
                        <option value="">--Seleccione--</option> <!-- placeholder con valor deshabilitado -->
                    </select>
                </div>                 
            </div>
     
            <div class="form-row">

                <div class="form-group">
                    <!-- select de monedas -->
                    <label for="moneda_id">Moneda:</label>
                    <select id="moneda" name="moneda_id" required>
                        <option value="">--Seleccione--</option>
                        <!-- se realiza un stmt php para recorrer monedas y establecer una opcion select por cada ciclo -->
                        <?php foreach($monedas as $m): ?>
                            <option value="<?= htmlspecialchars($m['id']) ?>"><?= htmlspecialchars($m['nombre']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>            
                
                <div class="form-group">
                    <label for="precio">Precio:</label>
                    <input type="number" id="precio" name="precio" step="0.01" min="0.01" placeholder="Ej: 15.22"> <!-- step permite dos decimales y un salto de una centena; min establece que el valor mínimo es 0.01, es decir, no permite 0 ni números negativos-->
                </div>
            </div>
     
            <div class="form-group">
                <!-- se establece un orden distinto, de manera que los labels/inputs puedan estar organizados como checkbox de forma horizontal -->
                <!-- Ahora los materiales se cargan dinámicamente desde la BD usando tabla intersección -->
                <fieldset>
                    <legend>Material del Producto:</legend>
                    <div class="checkbox-container">
                        <?php foreach($materiales as $material): ?>
                            <label><input type="checkbox" name="materiales[]" value="<?= htmlspecialchars($material['id']) ?>"> <?= htmlspecialchars($material['nombre']) ?></label>
                        <?php endforeach; ?>
                    </div>
                </fieldset>
            </div>
     
            <div class="form-group">
                <!-- descripcion del producto -->
                <label for="descripcion">Descripción:</label>
                <textarea id="descripcion" name="descripcion" rows="4" placeholder="Describa las características del producto." minlength="10" maxlength="1000" required></textarea>
            </div>
                 <!-- guardar el producto -->
                 <button id="boton" type="submit">Guardar Producto</button>
     
             </form>
         </div>
    </div>

    <!-- etiqueta script para hacer referencia a index.js -->
    <script src="js/index.js"></script> 

</body>
</html>
