export class ProductoService {
    
    static async registrarProducto(formData) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            formData.append('ajax', '1');
            formData.append('action', 'registrar_producto');

            const response = await fetch('index.php', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                throw new Error('Respuesta no es JSON válido');
            }

            const data = await response.json();
            
            if (!data.hasOwnProperty('success')) {
                throw new Error('Formato de respuesta inválido');
            }
            
            return data;

        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw {
                    type: 'timeout',
                    message: 'La petición tardó demasiado tiempo',
                    details: ['Timeout después de 30 segundos']
                };
            }
            
            if (error.name === 'TypeError') {
                throw {
                    type: 'network',
                    message: 'Error de conexión de red',
                    details: [error.message]
                };
            }

            throw {
                type: 'server',
                message: error.message || 'Error del servidor',
                details: [error.message]
            };
        }
    }

    static async cargarSucursales(bodegaId) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const formData = new FormData();
            formData.append('ajax', '1');
            formData.append('action', 'obtener_sucursales');
            formData.append('bodega_id', bodegaId);

            const response = await fetch('index.php', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                throw new Error('Respuesta no es JSON válido');
            }

            const data = await response.json();
            
            if (!data.hasOwnProperty('success')) {
                throw new Error('Formato de respuesta inválido');
            }
            
            return data;

        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw {
                    type: 'timeout',
                    message: 'Error al cargar sucursales - timeout',
                    details: ['Timeout después de 15 segundos']
                };
            }
            
            if (error.name === 'TypeError') {
                throw {
                    type: 'network',
                    message: 'Error de conexión al cargar sucursales',
                    details: [error.message]
                };
            }

            throw {
                type: 'server',
                message: error.message || 'Error al cargar sucursales',
                details: [error.message]
            };
        }
    }

    static manejarError(error) {
        switch (error.type) {
            case 'timeout':
                return {
                    success: false,
                    message: error.message,
                    details: error.details || []
                };
            case 'network':
                return {
                    success: false,
                    message: error.message,
                    details: error.details || []
                };
            case 'server':
                return {
                    success: false,
                    message: error.message,
                    details: error.details || []
                };
            default:
                return {
                    success: false,
                    message: error.message || 'Error desconocido',
                    details: error.details || []
                };
        }
    }
}