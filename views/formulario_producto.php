<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario</title>
    <link rel="stylesheet" href="css/styles.css"> 
</head>
<body>
    <div class="container">

        <header>
            <h1>Formulario de Producto</h1>
        </header>


         <div class="contenido">

             <form method="POST" novalidate>

            <div class="form-row">
                <div class="form-group">
                    <label for="codigo">Código</label>
                    <input type="text" id="codigo" name="codigo" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{5,15}$" minlength="5" maxlength="15" placeholder="Ej: PRODO1K" required>
                </div>

                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" minlength="2" maxlength="50" placeholder="Ej: Set comedor" required>
                </div>    
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="bodega_id">Bodega:</label>
                    <select id="bodega" name="bodega_id" required>
                        <option value="">--Seleccione Bodega--</option>
                        <?php foreach($bodegas as $b): ?>
                            <option value="<?= htmlspecialchars($b['id']) ?>"><?= htmlspecialchars($b['nombre']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
         
                <div class="form-group">
                    <label for="sucursal_id">Sucursal:</label>
                    <select id="sucursal" name="sucursal_id" required disabled>
                        <option value="">--Previamente debe seleccionar una bodega--</option>
                    </select>
                </div>                 
            </div>
     
            <div class="form-row">

                <div class="form-group">
                    <label for="moneda_id">Moneda:</label>
                    <select id="moneda" name="moneda_id" required>
                        <option value="">--Seleccione Moneda--</option>
                        <?php foreach($monedas as $m): ?>
                            <option value="<?= htmlspecialchars($m['id']) ?>"><?= htmlspecialchars($m['nombre']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>            
                
                <div class="form-group">
                    <label for="precio">Precio:</label>
                    <input type="number" id="precio" name="precio" step="0.01" min="0.01" placeholder="Ej: 15.22" required>
                </div>
            </div>
     
            <div class="form-group">
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
                <label for="descripcion">Descripción:</label>
                <textarea id="descripcion" name="descripcion" rows="4" placeholder="Describa las características del producto." minlength="10" maxlength="1000" required></textarea>
            </div>
                 <button id="boton" type="submit">Guardar Producto</button>
     
             </form>
         </div>
    </div>

    <script type="module" src="js/main.js"></script> 

</body>
</html>
