export class UIUtils {
    
    static mostrarMensaje(mensaje, tipo = 'info') {
        alert(mensaje);
    }

    static setLoading(form, btnSubmit, loading) {
        btnSubmit.disabled = loading;
        btnSubmit.classList.toggle('loading', loading);
        
        form.querySelectorAll('input, select, textarea, button').forEach(field => {
            if (field !== btnSubmit && field.id !== 'sucursal') {
                field.disabled = loading;
            }
        });
    }

    static resetForm(form) {
        form.reset();
        
        form.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        const sucursalSelect = document.getElementById('sucursal');
        if (sucursalSelect) {
            sucursalSelect.innerHTML = '<option value=""></option>';
        }
    }

    static actualizarSucursales(sucursalSelect, data, bodegaId) {
        sucursalSelect.innerHTML = '<option value=""></option>';
        
        if (!bodegaId) {
            sucursalSelect.innerHTML = '<option value=""></option>';
            return;
        }

        if (data.success && data.data) {
            sucursalSelect.innerHTML = '<option value="">----</option>';

            data.data.forEach(sucursal => {
                const option = document.createElement('option');
                option.value = sucursal.id;
                option.textContent = sucursal.nombre;
                sucursalSelect.appendChild(option);
            });

        } else {
            sucursalSelect.innerHTML = '<option value="">--No hay sucursales disponibles--</option>';
        }
    }

    static mostrarErrorSucursales(sucursalSelect) {
        sucursalSelect.innerHTML = '<option value="">--Error al cargar sucursales--</option>';
    }
}