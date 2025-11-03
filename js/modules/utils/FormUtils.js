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
        });
        
        const materialesChecked = document.querySelectorAll('input[name="materiales[]"]:checked');
        materialesChecked.forEach(material => {
            formData.append('materiales[]', material.value);
        });

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

    static configurarEventosPrecio(precioInput) {
        if (precioInput) {
            precioInput.addEventListener('blur', () => this.formatearPrecio(precioInput));
            precioInput.addEventListener('input', () => this.limitarDecimales(precioInput));
        }
    }

    static obtenerValoresFormulario(form) {
        const formData = new FormData(form);
        const valores = {};
        
        for (let [key, value] of formData.entries()) {
            if (key.endsWith('[]')) {
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

    static validarCamposRequeridos(form) {
        const camposRequeridos = form.querySelectorAll('[required]');
        
        for (let campo of camposRequeridos) {
            if (!campo.value.trim()) {
                return false;
            }
        }
        
        return true;
    }

    static limpiarFormulario(form) {
        form.reset();
        
        form.querySelectorAll('.error, .is-invalid').forEach(element => {
            element.classList.remove('error', 'is-invalid');
        });
        
        form.querySelectorAll('.error-message, .invalid-feedback').forEach(element => {
            element.style.display = 'none';
        });
    }
}