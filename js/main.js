// Controlador principal para la gestión de productos - Frontend usando AJAX
import { ProductoValidator } from './modules/validators/ProductoValidator.js';
import { ProductoService } from './modules/services/ProductoService.js';
import { UIUtils } from './modules/utils/UIUtils.js';
import { FormUtils } from './modules/utils/FormUtils.js';

class Producto {

    constructor() {
        // elementos del DOM
        this.form = document.querySelector('form'); 
        this.btnSubmit = document.getElementById('boton');

        this.init();
    }

    init() {
        this.bindEvents();
    }

    // relacionar eventos con funciones, manipulando el DOM
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        document.getElementById('bodega').addEventListener('change', (e) => {
            this.cargarSucursales(e.target.value);
        });

        this.form.querySelectorAll('input[name="materiales[]"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validarMateriales())
        });

        // Configurar eventos para campo precio
        const precioInput = document.getElementById('precio');
        FormUtils.configurarEventosPrecio(precioInput);
    }

    // función asíncrona que maneja el submit del formulario
    async handleSubmit(e) {
        e.preventDefault();

        UIUtils.mostrarDebugInfo(this.form);

        // validar todos los campos usando el validador
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

    // Carga las sucursales para la bodega seleccionada
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
            console.error('Error al cargar sucursales:', error);
            this.manejarError(error);
            UIUtils.mostrarErrorSucursales(sucursalSelect);
        }
    }

    // Validar materiales usando el validador
    validarMateriales() {
        return ProductoValidator.validarMateriales(this.form);
    }

    // Manejar errores de la aplicación
    manejarError(error) {
        const errorData = ProductoService.manejarError(error);
        
        if (errorData.details && errorData.details.length > 0) {
            console.error('Detalles del error:', errorData.details);
        }
        
        UIUtils.mostrarMensaje(errorData.message, 'error');
    }
}

// Función que crea una instancia de clase de producto al cargar el DOM 
document.addEventListener('DOMContentLoaded', function() {
    new Producto();
});