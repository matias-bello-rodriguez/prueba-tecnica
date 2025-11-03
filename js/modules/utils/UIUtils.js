export class UIUtils {
    
    static mostrarMensaje(mensaje, tipo = 'info') {
        alert(mensaje);
        
        console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
    }

    static setLoading(form, btnSubmit, loading) {
        btnSubmit.disabled = loading;
        btnSubmit.classList.toggle('loading', loading);
        
        form.querySelectorAll('input, select, textarea, button').forEach(field => {
            if (field !== btnSubmit) {
                field.disabled = loading;
            }
        });
    }

    static resetForm(form) {
        form.reset();
        
        form.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        
        // Limpiar clases de error
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        // Resetear sucursales
        const sucursalSelect = document.getElementById('sucursal');
        if (sucursalSelect) {
            sucursalSelect.innerHTML = '<option value="">--Previamente debe seleccionar una bodega--</option>';
            sucursalSelect.disabled = true;
        }
    }

    static actualizarSucursales(sucursalSelect, data, bodegaId) {
        sucursalSelect.innerHTML = '<option value="">--Selecciona--</option>';
        sucursalSelect.disabled = true;
        
        if (!bodegaId) {
            sucursalSelect.innerHTML = '<option value="">--Previamente debe seleccionar una bodega--</option>';
            return;
        }

        if (data.success && data.data) {
            sucursalSelect.innerHTML = '<option value="">--Seleccione una sucursal--</option>';

            data.data.forEach(sucursal => {
                const option = document.createElement('option');
                option.value = sucursal.id;
                option.textContent = sucursal.nombre;
                sucursalSelect.appendChild(option);
            });

            sucursalSelect.disabled = false;

        } else {
            sucursalSelect.innerHTML = '<option value="">--No hay sucursales disponibles--</option>';
        }
    }

    static mostrarErrorSucursales(sucursalSelect) {
        sucursalSelect.innerHTML = '<option value="">--Error al cargar sucursales--</option>';
        sucursalSelect.disabled = true;
    }

    static mostrarDebugInfo(form) {
        console.log('=== DIAGNÓSTICO COMPLETO ===');
        
        console.log('Formulario encontrado:', !!form);
        console.log('Formulario válido:', form ? form.checkValidity() : 'No hay formulario');
        
        // 2. Contar todos los campos
        const campos = form ? form.querySelectorAll('input, select, textarea') : [];
        console.log('Total de campos encontrados:', campos.length);
        
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

        const formData = new FormData(form);
        console.log('=== FORMDATA ENTRIES ===');
        let entryCount = 0;
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: "${value}"`);
            entryCount++;
        }
        console.log('Total entries en FormData:', entryCount);
        
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
}