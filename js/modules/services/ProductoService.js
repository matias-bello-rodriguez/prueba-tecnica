export class ProductoService {
    
    static async registrarProducto(formData) {
        try {
            formData.append('ajax', '1');
            formData.append('action', 'registrar_producto');

            const response = await fetch('index.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error HTTP con status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            throw {
                type: 'network',
                message: 'Error de conexión',
                details: [error.message]
            };
        }
    }

    static async cargarSucursales(bodegaId) {
        try {
            const formData = new FormData();
            formData.append('ajax', '1');
            formData.append('action', 'obtener_sucursales');
            formData.append('bodega_id', bodegaId);

            const response = await fetch('index.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error HTTP con status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            throw {
                type: 'network',
                message: 'Error al cargar sucursales',
                details: [error.message]
            };
        }
    }

    static manejarError(error) {
        console.error('Error en ProductoService:', error);
        
        if (error.type === 'network') {
            return {
                success: false,
                message: error.message,
                details: error.details || []
            };
        }
        
        return {
            success: false,
            message: error.message || 'Error desconocido',
            details: error.details || []
        };
    }
}