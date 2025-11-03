export class FormUtils {
    
    static crearFormData(form) {
        const formData = new FormData();
        
        const campos = {
            codigo: document.getElementById('codigo'),
            nombre: document.getElementById('nombre'),
            bodega: document.getElementById('bodega'),
            sucursal: document.getElementById('sucursal'),
            moneda: document.getElementById('moneda'),
            precio: document.getElementById('precio'),
            descripcion: document.getElementById('descripcion')
        };
        
        Object.entries(campos).forEach(([key, element]) => {
            if (element && element.value) {
                const fieldName = key === 'bodega' ? 'bodega_id' : 
                                key === 'sucursal' ? 'sucursal_id' : 
                                key === 'moneda' ? 'moneda_id' : key;
                formData.append(fieldName, element.value);
            }
        return formData;
    }

    static formatearPrecio(input) {
        let valor = parseFloat(input.value);
        if (!isNaN(valor) && valor > 0) {
            input.value = valor.toFixed(2);
        }
    }

    static limitarDecimales(input) {
        let valor = input.value;
        
        if (valor.includes('.')) {
            const partes = valor.split('.');
            if (partes[1] && partes[1].length > 2) {
                input.value = partes[0] + '.' + partes[1].substring(0, 2);
            }
        }
    }

    /**
     * Configura los eventos de formateo para un campo de precio
     * @param {HTMLInputElement} precioInput - El input del precio
     */
    static configurarEventosPrecio(precioInput) {
        if (precioInput) {
            precioInput.addEventListener('blur', () => this.formatearPrecio(precioInput));
            precioInput.addEventListener('input', () => this.limitarDecimales(precioInput));
        }
    }

    /**
     * Obtiene todos los valores del formulario como un objeto
     * @param {HTMLFormElement} form - El formulario
     * @returns {Object} - Objeto con todos los valores del formulario
     */
    static obtenerValoresFormulario(form) {
        const formData = new FormData(form);
        const valores = {};
        
        for (let [key, value] of formData.entries()) {
            if (key.endsWith('[]')) {
                // Para arrays (como materiales[])
                const baseKey = key.replace('[]', '');
                if (!valores[baseKey]) {
                    valores[baseKey] = [];
                }
                valores[baseKey].push(value);
            } else {
                valores[key] = value;
            }
        }
        
        return valores;
    }

    /**
     * Valida si un formulario tiene todos los campos requeridos completados
     * @param {HTMLFormElement} form - El formulario a validar
     * @returns {boolean} - true si todos los campos requeridos están completos
     */
    static validarCamposRequeridos(form) {
        const camposRequeridos = form.querySelectorAll('[required]');
        
        for (let campo of camposRequeridos) {
            if (!campo.value.trim()) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Limpia un formulario y resetea todos sus estados
     * @param {HTMLFormElement} form - El formulario a limpiar
     */
    static limpiarFormulario(form) {
        form.reset();
        
        // Remover clases de error
        form.querySelectorAll('.error, .is-invalid').forEach(element => {
            element.classList.remove('error', 'is-invalid');
        });
        
        // Ocultar mensajes de error
        form.querySelectorAll('.error-message, .invalid-feedback').forEach(element => {
            element.style.display = 'none';
        });
    }
}