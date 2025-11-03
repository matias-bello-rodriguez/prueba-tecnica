// este archivo se ocupa de manejar la logica del frotnend usando AJAX
import { ProductoValidator } from './modules/validators/ProductoValidator.js';
import { ProductoService } from './modules/services/ProductoService.js';
import { UIUtils } from './modules/utils/UIUtils.js';
import { FormUtils } from './modules/utils/FormUtils.js';

class Producto {

    constructor() {
        this.form = document.querySelector('form'); 
        this.btnSubmit = document.getElementById('boton');

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        document.getElementById('bodega').addEventListener('change', (e) => {
            this.cargarSucursales(e.target.value);
        });

        this.form.querySelectorAll('input[name="materiales[]"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validarMateriales())
        });

        const precioInput = document.getElementById('precio');
        FormUtils.configurarEventosPrecio(precioInput);
    }

    async handleSubmit(e) {
        e.preventDefault();

        const validacion = ProductoValidator.validarTodosLosCampos(this.form);
        if (!validacion.isValid) {
            ProductoValidator.mostrarAlertaValidacion(validacion.errors);
            return;
        }
        
        UIUtils.setLoading(this.form, this.btnSubmit, true);

        try {
            const formData = FormUtils.crearFormData(this.form);
            const data = await ProductoService.registrarProducto(formData);
            
            if (data.success) {
                UIUtils.mostrarMensaje(data.message, 'success');
                UIUtils.resetForm(this.form);
            } else {
                this.manejarError(data);
            }

        } catch (error) {
            this.manejarError(error);
        } finally {
            UIUtils.setLoading(this.form, this.btnSubmit, false);
        }
    }

    async cargarSucursales(bodegaId) {
        const sucursalSelect = document.getElementById("sucursal");

        // Resetear select inicial
        UIUtils.actualizarSucursales(sucursalSelect, { success: false }, null);
        
        if (!bodegaId) {
            return;
        }

        try {
            const data = await ProductoService.cargarSucursales(bodegaId);
            UIUtils.actualizarSucursales(sucursalSelect, data, bodegaId);

        } catch (error) {
            this.manejarError(error);
            UIUtils.mostrarErrorSucursales(sucursalSelect);
        }
    }

    validarMateriales() {
        return ProductoValidator.validarMateriales(this.form);
    }

    manejarError(error) {
        const errorData = ProductoService.manejarError(error);
        
        UIUtils.mostrarMensaje(errorData.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new Producto();
});