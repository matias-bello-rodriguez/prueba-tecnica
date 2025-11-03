export class ProductoValidator {
    
    static validarTodosLosCampos(form) {
        let errores = [];

        form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            const error = this.validarCampo(field);
            if (error) {
                errores.push(error);
            }
        });

        // validar materiales
        const errorMateriales = this.validarMateriales(form);
        if (errorMateriales) {
            errores.push(errorMateriales);
        }

        return {
            isValid: errores.length === 0,
            errors: errores
        };
    }

    static validarCampo(field) {
        const valor = field.value.trim();
        const nombreCampo = field.name;
        let errorMsj = '';

        switch (nombreCampo) {
            case 'codigo':
                const regexCodigo = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{5,15}$/;
                if (!valor) {
                    errorMsj = 'El código es requerido';
                } else if (!regexCodigo.test(valor)) {
                    errorMsj = 'El código debe tener 5-15 caracteres (solo letras, números, espacios y guiones)';
                }
                break;
                
            case 'nombre':
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
                if (!valor || valor === '' || valor === '0') {
                    const nombreLimpio = nombreCampo.replace('_id', '').replace('_', ' ');
                    errorMsj = `Debe seleccionar una ${nombreLimpio}`;
                }
                break;
                
            case 'precio':
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
                const regexDescripcion = /^.{10,1000}$/s;
                if (!valor) {
                    errorMsj = 'La descripción es requerida';
                } else if (!regexDescripcion.test(valor)) {
                    errorMsj = 'La descripción debe tener entre 10 y 1000 caracteres';
                }
                break;
        }

        return errorMsj;
    }

    static validarMateriales(form) {
        const checkboxes = form.querySelectorAll('input[name="materiales[]"]:checked');

        if (checkboxes.length < 2) {
            return 'Debe seleccionar al menos 2 materiales';
        }
        
        return null;
    }

    static mostrarAlertaValidacion(errores) {
        let mensaje = "Por favor, corrija los siguientes errores:\n\n";
        
        errores.forEach((error, index) => {
            mensaje += `${index + 1}. ${error}\n`;
        });
        
        alert(mensaje);
    }
}