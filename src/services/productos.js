// ============================================================
// productos.js — Servicio de menú/productos para el cliente
// Coche Comedor — src/services/productos.js
// ============================================================
//
// Obtiene el menú de productos disponibles desde la API REST.
// Si la API no responde, el llamador puede usar el menú estático
// como fallback (ver OrderApp.jsx).
// ============================================================

// URL base de la API — configurable por entorno (.env)
const API_URL = import.meta.env.VITE_API_URL || 'https://coche-comedor-api.onrender.com/api/v1';

/**
 * Obtiene todos los productos disponibles desde la API.
 * Solo retorna productos con disponible=true y stock>0.
 *
 * @returns {Promise<Array>} Lista de productos con: id, codigo, nombre, descripcion, precio, imagen, categoria
 * @throws {Error} Si la API no está disponible o retorna un error HTTP
 */
export async function obtenerMenuAPI() {
  const response = await fetch(`${API_URL}/productos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.message || `Error ${response.status} al cargar el menú`);
  }

  const { data } = await response.json();
  return data || [];
}
