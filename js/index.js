// este archivo se ocupa de manejar la logica del frotnend usando AJAX

class Producto{


    constructor(){
        //funciones para manipular DOM
        this.form = document.querySelector('form'); 
        this.btnSubmit = document.getElementById('boton');


        this.init();
    }

    init(){
        this.bindEvents();
    }

    // relacionar eventos con funciones, maniulando el DOM

    bindEvents(){
        this.form.addEventListener('submit', (e) => this.handleSubmit(e)); //listener para disparar envio de form

        document.getElementById('bodega').addEventListener('change', (e) => {
            this.cargarSucursales(e.target.value);
        }); //listener para disparar cagar sucursales

        this.form.querySelectorAll('input[name="materiales[]"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validarMateriales())
        });//listener para disparar la funcion validarMateriales

        //agregar evento para campo precio
        const precioInput = document.getElementById('precio');
        if (precioInput) {
            precioInput.addEventListener('blur', () => this.formatearPrecio(precioInput));
            precioInput.addEventListener('input', () => this.limitarDecimales(precioInput));
        }
    }

    //funcion para dar formato de decimales
    formatearPrecio(input) {
        let valor = parseFloat(input.value);
        if (!isNaN(valor) && valor > 0) {
            input.value = valor.toFixed(2); //fijar el valor en 2 decimales
        }
    }

    //funcion para dar límite de dos a los decimales
    limitarDecimales(input) {
        let valor = input.value;
        
        // si tiene punto decimal, limitar a 2 decimales
        if (valor.includes('.')) {
            const partes = valor.split('.');
            if (partes[1] && partes[1].length > 2) {
                input.value = partes[0] + '.' + partes[1].substring(0, 2);
            }
        }
    }


    // función asincrona que espera el submit del formulario
    async handleSubmit(e){
        e.preventDefault();

        this.mostrarDebugInfo();

        if (!this.validarTodosLosCampos()) {
            return;
        }
        
        this.setLoading(true); //marcar evento como cargando

        try {
            const formData = this.crearFormData();

            const response = await fetch('index.php',{
                method: 'POST',
                body: formData
            });

            //lanzar excepción si la respuesta no es exitosa
            if (!response.ok) {
                throw new Error(`Error HTTP con status: ${response.status}`);
            }            

            //definir variable data con la respuesta JSON enviada de PHP
            const data = await response.json();
            
            if(data.success){
                alert(data.message);
                this.resetForm();
            }else{
                alert(data.message);
            }

        } catch (error) {
            alert('Error de conexión');
        } finally{
            this.setLoading(false);
        }
    }

    // método para crear FormData con todos los campos del formulario
    crearFormData(){
        const formData = new FormData();
        formData.append('ajax', '1');
        formData.append('action', 'registrar_producto');
        
        // los campos del formulario
        const campos = {
            codigo: document.getElementById('codigo'),
            nombre: document.getElementById('nombre'),
            bodega: document.getElementById('bodega'),
            sucursal: document.getElementById('sucursal'),
            moneda: document.getElementById('moneda'),
            precio: document.getElementById('precio'),
            descripcion: document.getElementById('descripcion')
        };
        
        // agregar campos individuales al FormData
        Object.entries(campos).forEach(([key, element]) => {
            if (element && element.value) {
                const fieldName = key === 'bodega' ? 'bodega_id' : 
                                key === 'sucursal' ? 'sucursal_id' : 
                                key === 'moneda' ? 'moneda_id' : key;
                formData.append(fieldName, element.value);
            }
        });
        
        // agregar materiales seleccionados
        const materialesChecked = document.querySelectorAll('input[name="materiales[]"]:checked');
        materialesChecked.forEach(material => {
            formData.append('materiales[]', material.value);
        });

        return formData;
    }

    mostrarDebugInfo(){
        console.log('=== DIAGNÓSTICO COMPLETO ===');
        
        // 1. Verificar que el formulario existe
        console.log('Formulario encontrado:', !!this.form);
        console.log('Formulario válido:', this.form ? this.form.checkValidity() : 'No hay formulario');
        
        // 2. Contar todos los campos
        const campos = this.form ? this.form.querySelectorAll('input, select, textarea') : [];
        console.log('Total de campos encontrados:', campos.length);
        
        // 3. Listar cada campo y su valor
        console.log('=== CAMPOS Y VALORES ===');
        campos.forEach((campo, index) => {
            let valor = '';
            if (campo.type === 'checkbox') {
                valor = campo.checked ? campo.value : '(no marcado)';
            } else {
                valor = campo.value || '(vacío)';
            }
            console.log(`${index + 1}. ${campo.name || 'SIN NAME'} (${campo.type || campo.tagName}): "${valor}"`);
        });

        // 4. Verificar FormData
        const formData = new FormData(this.form);
        console.log('=== FORMDATA ENTRIES ===');
        let entryCount = 0;
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: "${value}"`);
            entryCount++;
        }
        console.log('Total entries en FormData:', entryCount);
        
        // 5. Verificar manualmente los valores más importantes
        console.log('=== VERIFICACIÓN MANUAL ===');
        console.log('Código:', document.getElementById('codigo')?.value || 'NO ENCONTRADO');
        console.log('Nombre:', document.getElementById('nombre')?.value || 'NO ENCONTRADO');
        console.log('Bodega:', document.getElementById('bodega')?.value || 'NO ENCONTRADO');
        console.log('Sucursal:', document.getElementById('sucursal')?.value || 'NO ENCONTRADO');
        console.log('Moneda:', document.getElementById('moneda')?.value || 'NO ENCONTRADO');
        console.log('Precio:', document.getElementById('precio')?.value || 'NO ENCONTRADO');
        console.log('Descripción:', document.getElementById('descripcion')?.value || 'NO ENCONTRADO');
        
        const materialesChecked = document.querySelectorAll('input[name="materiales[]"]:checked');
        console.log('Materiales seleccionados:', materialesChecked.length);
        materialesChecked.forEach(mat => console.log('- Material:', mat.value));
        console.log('===============================');
    }

    async cargarSucursales(bodegaId){
        const sucursalSelect = document.getElementById("sucursal"); //traer el valor de sucursalID

        //se toma el html del select de sucursal
        sucursalSelect.innerHTML = '<option value="">--Selecciona--</option>'
        
        //se deshabilita la opción de placeholder
        sucursalSelect.disabled = true;
        
        // si no existe un atributo de bodegaId, el select no queda accesible
        if(!bodegaId){
            sucursalSelect.innerHTML = '<option value="">--Previamente debe seleccionar una bodega--</option>';
            return;
        }

        try {
            const formData = new FormData();
            formData.append('ajax', '1');
            formData.append('action', 'obtener_sucursales');
            formData.append('bodega_id', bodegaId);

            const response = await fetch('index.php',{
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            // si el json devuelve succes = true, y existe data, crea un select de placeholder para cuando ya se seleccionó una bodega
            if(data.success && data.data){
                sucursalSelect.innerHTML = '<option value="">--Seleccione una sucursal--</option>';


            data.data.forEach(sucursal => {
                const option = document.createElement('option');
                option.value = sucursal.id;
                option.textContent = sucursal.nombre;
                sucursalSelect.appendChild(option);

                // por cada sucursal que exista, se crea un elemento u objeto option en el DOM con valor id y texto nombre

            });

            // habilitamos el select de sucursal
            sucursalSelect.disabled = false;

            //en el caso de que no hayan datos en la BD
            }else{
                sucursalSelect.innerHTML = '<option value="">--No hay sucursales disponibles--</option>';
            }

            //exception
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
            sucursalSelect.innerHTML = '<option value="">--Error al cargar sucursales--</option>';            
        }
        
     }

    validarTodosLosCampos(){
        let errores = []; //variable con scope para toda la funcion no estática para acumular errores

        //toma todos los elementos con valores y los valida
        this.form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            const error = this.validarCampo(field); //constante validado
            if (error) {
                errores.push(error);
            }//guarda el error en el array de errores
        });

        // validar materiales
        const errorMateriales = this.validarMateriales();
        if (errorMateriales) {
            errores.push(errorMateriales);
        }
                
        // si hay errores, mostrar alerta personalizada
        if (errores.length > 0) {
            this.mostrarAlertaValidacion(errores);
            return false;
        }

        return true;
    }

    //VALIDACIONES REGEX
    //valida cada campo individualmente usando REGEX para mayor precisión
    validarCampo(field){
        const valor = field.value.trim(); //elimina espacio al inicio y final
        const nombreCampo = field.name; //obtenemos el nombre del campo de los select, input o textarea
        let errorMsj = '';

        console.log(`Validando ${nombreCampo}:`, `"${valor}"`);

        // hacemos un switch para resolver cada atributo dependiendo del tipo
        switch (nombreCampo) {
            case 'codigo':
                // Solo letras, números, guiones y espacios, entre 5-15 caracteres
                const regexCodigo = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{5,15}$/;                if (!valor) {
                    errorMsj = 'El código es requerido';
                } else if (!regexCodigo.test(valor)) {
                    errorMsj = 'El código debe tener 5-15 caracteres (solo letras, números, espacios y guiones)';
                }
                break;
                
            case 'nombre':
                // Solo letras, espacios, tildes, ñ, guiones y puntos, entre 2-50 caracteres
                const regexNombre = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s\-\.]{2,50}$/;
                if (!valor) {
                    errorMsj = 'El nombre es requerido';
                } else if (!regexNombre.test(valor)) {
                    errorMsj = 'El nombre debe tener 2-50 caracteres (solo letras, espacios, tildes y signos de puntuación básicos)';
                }
                break;
                
            case 'bodega_id':
            case 'sucursal_id':
            case 'moneda_id':
                // Validación para selects: debe tener un valor válido (no vacío ni placeholder)
                if (!valor || valor === '' || valor === '0') {
                    const nombreLimpio = nombreCampo.replace('_id', '').replace('_', ' ');
                    errorMsj = `Debe seleccionar una ${nombreLimpio}`;
                }
                break;
                
            case 'precio':
                // Números decimales positivos con MÁXIMO 2 decimales
                const regexPrecio = /^(\d+|\d+\.\d{1,2})$/;
                if (!valor) {
                    errorMsj = 'El precio es requerido';
                } else if (!regexPrecio.test(valor)) {
                    errorMsj = 'El precio debe ser un número válido con máximo 2 decimales (ejemplo: 123.45)';
                } else if (parseFloat(valor) <= 0) {
                    errorMsj = 'El precio debe ser mayor a 0';
                } else if (parseFloat(valor) > 999999.99) {
                    errorMsj = 'El precio no puede exceder 999,999.99';
                }
                break;
                
            case 'descripcion':
                // Cualquier carácter incluyendo saltos de línea, entre 10-1000 caracteres
                const regexDescripcion = /^.{10,1000}$/s;
                if (!valor) {
                    errorMsj = 'La descripción es requerida';
                } else if (!regexDescripcion.test(valor)) {
                    errorMsj = 'La descripción debe tener entre 10 y 1000 caracteres';
                }
                break;
        }        

        return errorMsj; //retornar mensaje de error o string vacío si no hay error
    }

    // funcion que valida que haya al menos dos checkbox seleccionados
    validarMateriales(){
        const checkboxes = this.form.querySelectorAll('input[name="materiales[]"]:checked'); //guarda los checkbox q estan checked

        console.log(`Materiales seleccionados: ${checkboxes.length}`); // Debug


        if (checkboxes.length < 2) {
            return 'Debe seleccionar al menos 2 materiales';
        }
        
        return null; // No hay error
    }

    mostrarAlertaValidacion(errores) {
        let mensaje = "Por favor, corrija los siguientes errores:\n\n";
        
        errores.forEach((error, index) => {
            mensaje += `${index + 1}. ${error}\n`;
        });
        
        alert(mensaje); // mostrar todos los errores en una sola alerta
    }

    //estalece el estado de cargando al enviar el formulario
    setLoading(loading) {
        this.btnSubmit.disabled = loading;
        this.btnSubmit.classList.toggle('loading', loading);
        
        // deshabilitar todos los campos durante la carga
        this.form.querySelectorAll('input, select, textarea, button').forEach(field => {
            if (field !== this.btnSubmit) {
                field.disabled = loading;
            }
        });
    }


    //funcion que resetea el formulario
    resetForm() {
        this.form.reset();
        
        // Limpiar errores
        this.form.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        
        // Limpiar clases de error
        this.form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        // Resetear sucursales
        const sucursalSelect = document.getElementById('sucursal');
        if (sucursalSelect) {
            sucursalSelect.innerHTML = '<option value="">--Previamente debe seleccionar una bodega--</option>';
            sucursalSelect.disabled = true;
        }
    }
    
}    

//funcion de javascript que crea una instancia de clase de producto, ocupada de cargar el Dom 
document.addEventListener('DOMContentLoaded', function() {
    new Producto();
});


