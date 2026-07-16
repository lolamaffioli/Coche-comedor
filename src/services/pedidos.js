// URL base de la API — configurable por entorno (.env)
const API_URL = import.meta.env.VITE_API_URL || 'https://coche-comedor-api.onrender.com/api/v1';

export const enviarPedidoAPI = async (datosPedido) => {
  const response = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosPedido)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al procesar el pedido');
  }

  return data;
};