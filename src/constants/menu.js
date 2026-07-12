// ──────────────────────────────────────────────────────────────────────────────
// Menú base compartido
// ──────────────────────────────────────────────────────────────────────────────
const menuBase = {
  Cafeteria: [
    { id: 1, name: "Café simple", desc: "Café caliente servido en el momento, 180ml", price: 1900, img: "/menu/Café con o sin leche.jpeg" },
    { id: 2, name: "Café con leche", desc: "Café con leche caliente, ½ leche ½ café, 180ml", price: 2500, img: "/menu/Café con o sin leche.jpeg" },
    { id: 3, name: "Cortado", desc: "Cortado caliente, ¼ leche ¾ café, 180ml", price: 2500, img: "/menu/Café con o sin leche.jpeg" },
    { id: 4, name: "Té", desc: "Infusión caliente de té, 240ml", price: 500, img: "/menu/Té o Matecocido.jpeg" },
    { id: 5, name: "Mate cocido", desc: "Infusión caliente de yerba mate, 240ml", price: 500, img: "/menu/Té o Matecocido.jpeg" },
    { id: 6, name: "2 Medialunas", desc: "Clásica medialuna de manteca caliente", price: 2000, img: "/menu/Medialunas.jpeg" },
    { id: 7, name: "Alfajor Negro", desc: "Alfajor de chocolate relleno de dulce de leche", price: 2000, img: "/menu/Alfajor Negro.jpeg" },
    { id: 8, name: "Alfajor Blanco", desc: "Alfajor de chocolate blanco relleno de dulce de leche", price: 2000, img: "/menu/Alfajor Blanco.jpeg" },
  ],
  Sandwiches: [
    { id: 9, name: "Pebete de jamón y queso", desc: "Pebete de jamón y queso en pan de viena", price: 4000, img: "/menu/Sanguches.jpeg" },
    { id: 10, name: "Tostado de miga triple", desc: "Tostado triple de miga jamón y queso", price: 4000, img: "/menu/Sanguches.jpeg" },
  ],
  Bebidas: [
    { id: 11, name: "Agua mineral", desc: "Agua mineral sin gas, 500 ml", price: 1500, img: "/menu/Agua Mineral.jpeg" },
    { id: 12, name: "Agua saborizada", desc: "Agua saborizada sabor naranja, 500 ml", price: 2000, img: "/menu/Agua Saborizada.jpeg" },
    { id: 13, name: "Gaseosa Cola", desc: "Gaseosa de Cola sabor original, 500 ml", price: 3500, img: "/menu/Gaseosa Cola.jpeg" },
    { id: 14, name: "Gaseosa Lima Limón", desc: "Gaseosa de Lima Limón sabor original, 500 ml", price: 3500, img: "/menu/Gaseosa Lima Limón.jpeg" },
  ],
  Snacks: [
    { id: 15, name: "Bizcochos", desc: "Paquete clásico de bizcochos", price: 3500, img: "/menu/Don Satur Salados.jpeg" },
    { id: 16, name: "Galletitas", desc: "Paquete de galletitas dulces chico", price: 2800, img: "/menu/Macucas.jpeg" },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// Menús por recorrido
// Cada recorrido tiene su propia copia independiente del menú.
// Podés editar los items de cada recorrido por separado (ej: cambiar stock,
// agregar o quitar productos, cambiar precios, etc.)
// ──────────────────────────────────────────────────────────────────────────────

// Función helper para clonar el menú base (evita que los recorridos compartan referencia)
function clonarMenu(menu) {
  return Object.fromEntries(
    Object.entries(menu).map(([cat, items]) => [
      cat,
      items.map((item) => ({ ...item })),
    ])
  );
}

export const menuByRecorrido = {
  1: clonarMenu(menuBase), // Recorrido 1 — editá esta copia para personalizar
  2: clonarMenu(menuBase), // Recorrido 2
  3: clonarMenu(menuBase), // Recorrido 3
  4: clonarMenu(menuBase), // Recorrido 4
  5: clonarMenu(menuBase), // Recorrido 5
  6: clonarMenu(menuBase), // Recorrido 6
  7: clonarMenu(menuBase), // Recorrido 7
  8: clonarMenu(menuBase), // Recorrido 8
};

// Exportamos también el menú base por si se necesita en otro lado
export const menuItems = menuBase;

export const timeSlots = ["En 10 minutos", "En 20 minutos", "En 30 minutos", "En 45 minutos", "En 1 hora"];
