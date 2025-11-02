// este archivo se ocupa de manejar la logica del frotnend usando AJAX

class Producto{


    constructor(){
        //funciones para manipular DOM
        this.form = document.getElementById('formulario_producto'); 
        this.btnSubmit = document.getElementById('boton_id');

        this.init();
    }

    init(){
    }

    // relacionar eventos con funciones, maniulando el DOM

    bindEvents(){
        this.form.addEventListener('submit', (e) => this.handleSubmit(e)); //listener para disparar envio de form

        document.getElementById('bodega_id').addEventListener('change', (e) => {
            this.cargarSucursales(e.target.value);
        }); //listener para disparar cagar sucursales

        this.form.querySelectorAll('input[name="materiales[]"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validarMateriales())
        });//listener para disparar la funcion validarMateriales
    
    }


    //inicia la validacion del form
    initValidacion() {
        // previne envio en caso de que las validaciones marcquen el fomrulario como invalido
        this.form.addEventListener('invalid', (e) => {
            e.preventDefault(); //listner para verificar si el formulario es invalido
            this.validarTodosLosCampos();//invocar a funcion para validar los formularios
        }, true);
    }    

    // función asincrona que espera el submit del formulario
    async handleSubmit(e){
        e.preventDefault();

        // si la funcion validarTodosLosCampos no se ha ejecutado, mostrar alerta

        if (!this.validarTodosLosCampos()) {
            this.showAlert('Por favor, corrija los errores en el formulario', 'error');
            return;
        }
        
        this.setLoading(true); //marcar evento como cargando

        try {
            const formData = new FormData(this.form); //crear una constante formData con el objeto FormData 
            formData.append('ajax', '1') //pasar parámetros ajax a el array

            //pasar la respuesta con parámetros de archivo y objeto con metodo y cuerpo
            const response = await fetch('index.php',{
                method: 'POST',
                body: formData
            });

            //lanzar excepción
            if (!response.ok) {
                throw new Error(`error HTTP con status: ${response.status}`);
            }            

            //definir variable data con la respuesta JSON enviada de PHP
            const data = await response.json();
            
            // si dentro de data, el valor de la key succes es true, devuelve alerta y resetea el formulario, de otra forma desplega el error

            if(data.success){
                this.showAlert(data.message, 'success');
                this.resetForm()
            }else{
                this.showAlert(data.message, 'error')
            }

        //al encontrar una excepcion    
        } catch (error) {
            this.showAlert('Error de conexión')
        } finally{
            this.setLoading(false) //de cualquier forma, el estado de cargado se modifica a false
        }

    }

    async cargarSucursales(bodegaId){
        const selectSucursal = document.getElementById("sucursal_id"); //traer el valor de sucursalID

        //se toma el html del select de sucursal
        selectSucursal.innerHTML = '<option value="" disabled>--Seleccione--</option>'
        
        //se deshabilita la opción de placeholder
        selectSucursal.disabled = true;
        
        // si no existe un atributo de bodegaId, el select no queda accesible
        if(!bodegaId){
            selectSucursal.innerHTML = '<option value="">--Primero seleccione una bodega--</option>';
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
            sucursal.disabled = false;

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
        let esValido =  true; //variable global no estática para ver si un atributo es valida


        //toma todos los elementos con valores y los valida
        this.form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {

            if (!this.validarCampo(field)) {
                esValido = false;
            }

            // validar materiales
            if (!this.validarMateriales()) {
            esValido = false;
            }

            return esValido; //si no entra a ningun if, devuelve true

        });
}

    //valida cada campo indivudalmente
    validarCampo(field){
        const valor = field.value.trim(); //elimina espacio al inicio y final
        const nombreCampo = field.name; //obtenemos el nombre del campo de los select, input o textarea
        let esValido = true;
        let errorMsj = '';

        // hacemos un switch para resolver cada atributo dependiendo del tipo
         switch (nombreCampo) {
            case 'codigo_id':
                if (!valor) {
                    errorMsj = 'El código es requerido';
                    esValido = false;
                } else if (valor.length < 5 && valor.length > 15) {
                    errorMsj = 'El código no puede ser menor de 5 caracteres y mayor a 15';
                    esValido = false;
                }
                break;
                
            case 'nombre_id':
                if (!valor) {
                    errorMsj = 'El nombre es requerido';
                    esValido = false;
                } else if (valor.length < 2 && valor.length > 50) {
                    errorMsj = 'El código no puede ser menor de 2 caracteres y mayor a 50';
                    esValido = false;
                }
                break;
                
            case 'bodega_id':
            case 'sucursal_id':
            case 'moneda_id':
                if (!valor) {
                    errorMsj = 'Este campo es requerido';
                    esValido = false;
                }
                break;
                
            case 'precio_id':
                if (!valor) {
                    errorMsj = 'El precio es requerido';
                    esValido = false;
                } else if (parseFloat(valor) <= 0) {
                    errorMsj = 'El precio debe ser mayor a 0';
                    esValido = false;
                }
                break;
                
            case 'descripcion_id':
                if (!valor) {
                    errorMsj = 'La descripción es requerida';
                    esValido = false;
                } else if (valor.length < 10 && valor.length > 500) {
                    errorMsj = 'El código no puede ser menor de 10 caracteres y mayor a 500';
                    esValido = false;
                }
                break;
        }        

        this.showFieldError(field, errorMessage); //mostrar error de campo
        return esValido; //retornar true, si no entra a ning case del switch   
    }

    // funcion que valida que haya al menos dos checkbox seleccionados
    validarMateriales(){
        const checkboxes = this.form.querySelectorAll('input[name="materiales[]"]:checked'); //guarda los checkbox q estan checked

        const esValido = checkboxes.length >= 2; //verifica si los checbox son validos si son 2 o más
        
        const errorMsj = esValido ? '' : 'Debe seleccionar al menos 2 materiales';
        this.showFieldError(document.querySelector('input[name="materiales[]"]'), errorMsj);
        
        return esValido;
    }

    //funcion que muestra alerta al usuario
    showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        this.alertContainer.appendChild(alert);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
        
        // Scroll hacia arriba para mostrar la alerta
        this.alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }    

    //estalece el estado de cargando al enviar el formulario
    setLoading(loading) {
        this.btnSubmit.disabled = loading;
        this.btnSubmit.classList.toggle('loading', loading);
        
        // Deshabilitar todos los campos durante la carga
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
            error.textContent = '';
            error.style.display = 'none';
        });
        
        // Limpiar clases de error
        this.form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        // Resetear sucursales
        const sucursalSelect = document.getElementById('sucursal_id');
        sucursalSelect.innerHTML = '<option value="">--Primero seleccione una bodega--</option>';
        sucursalSelect.disabled = true;
        
        // Resetear contador de caracteres
        document.getElementById('char-count').textContent = '0';
        
        this.showAlert('Formulario limpiado', 'info');
    }
    
}    

//funcion de javascript que crea una instancia de clase de producto, ocupada de cargar el Dom 
document.addEventListener('DOMContentLoaded', () => {
    new Producto();
});
    

