// ──────────────────────────────────────────────────────────────────────────────
// Menú base compartido
// ──────────────────────────────────────────────────────────────────────────────
const menuBase = {
  Bebidas: [
    { id: 101, codigo: "101", name: "Agua mineral",                desc: "Agua mineral sin gas, 500 ml",                     price: 1500, img: "/Comida/Bebidas/agua.png" },
    { id: 102, codigo: "102", name: "Agua saborizada",             desc: "Agua saborizada sabor naranja, 500 ml",             price: 2000, img: "/Comida/Bebidas/agua saborizada.png" },
    { id: 103, codigo: "103", name: "Linea Cola",                  desc: "Gaseosa de Cola sabor original, 500 ml",            price: 3500, img: "/Comida/Bebidas/linea cola.png" },
    { id: 104, codigo: "104", name: "Linea Cola Light/Zero",       desc: "Gaseosa de Cola light/zero, 500 ml",                price: 3500, img: "/Comida/Bebidas/linea cola light.png" },
    { id: 105, codigo: "105", name: "Linea Lima Limón",            desc: "Gaseosa de Lima Limón sabor original, 500 ml",      price: 3500, img: "/Comida/Bebidas/Lima limon.png" },
    { id: 106, codigo: "106", name: "Linea Lima Limón Light/Zero", desc: "Gaseosa de Lima Limón light/zero, 500 ml",          price: 3500, img: "/Comida/Bebidas/Lima limon.png" },
    { id: 107, codigo: "107", name: "Jugo de Frutas",              desc: "Jugo de frutas, 500 ml",                            price: 3500, img: "/Comida/Bebidas/agua saborizada.png" },
    { id: 108, codigo: "108", name: "Agua Saborizada",             desc: "Agua saborizada, 500 ml",                           price: 3500, img: "/Comida/Bebidas/agua saborizada.png" },
    { id: 109, codigo: "109", name: "Linea Naranja",               desc: "Gaseosa de naranja, 500 ml",                        price: 3500, img: "/Comida/Bebidas/linea naranja.png" },
  ],
  Cafeteria: [
    { id: 200, codigo: "200", name: "Adicional Leche",             desc: "Porción adicional de leche caliente",               price: 1900, img: "/Comida/Cafeteria/Adicional leche (1).png" },
    { id: 201, codigo: "201", name: "Café",                        desc: "Café caliente, 180ml",                              price: 2500, img: "/Comida/Cafeteria/Café.png" },
    { id: 202, codigo: "202", name: "Sobre de Leche",              desc: "Sobre de leche en polvo",                           price: 2500, img: "/Comida/Cafeteria/Leche.png" },
    { id: 203, codigo: "203", name: "Té",                          desc: "Infusión caliente de té, 240ml",                    price: 500,  img: "/Comida/Cafeteria/Té.png" },
    { id: 204, codigo: "204", name: "Leche Chocolatada",           desc: "Leche chocolatada, 240ml",                          price: 500,  img: "/Comida/Cafeteria/chocolatada.png" },
    { id: 205, codigo: "205", name: "Paquete de Yerba",            desc: "Paquete de yerba mate",                             price: 2000, img: "/Comida/Cafeteria/yerba.png" },
    { id: 206, codigo: "206", name: "Mate Cocido",                 desc: "Infusión caliente de yerba mate, 240ml",            price: 2000, img: "/Comida/Cafeteria/yerba.png" },
    { id: 207, codigo: "207", name: "Vaso de Leche",               desc: "Vaso de leche caliente, 240ml",                    price: 2000, img: "/Comida/Cafeteria/Leche.png" },
    { id: 208, codigo: "208", name: "Leche para Mamadera",         desc: "Leche templada para mamadera",                      price: 3500, img: "/Comida/Cafeteria/Leche para mamadera.png" },
    { id: 209, codigo: "209", name: "Medialunas con Jamón y Queso",desc: "Medialunas rellenas de jamón y queso",              price: 3500, img: "/Comida/Cafeteria/Medialunas con jamon y queso.png" },
    { id: 210, codigo: "211", name: "Fichas p/Expendedora de Bebidas Calientes", desc: "Ficha para máquina expendedora",      price: 3500, img: "/Comida/Cafeteria/Fichas pmaquina.png" },
  ],
  Sandwicheria: [
    { id: 301, codigo: "301", name: "Árabe Jamón y Queso",                  desc: "Pan árabe con jamón y queso",              price: 4000, img: "/Comida/Sangucheria/Arabe de jamon y queso.png" },
    { id: 305, codigo: "305", name: "Sándwich de Miga con Jamón y Queso",   desc: "Sándwich de miga con jamón y queso",        price: 4000, img: "/Comida/Sangucheria/Sanguche de miga.png" },
    { id: 307, codigo: "307", name: "Pebete de Jamón y Queso",              desc: "Pebete en pan de viena con jamón y queso", price: 3500, img: "/Comida/Sangucheria/Pebete de jamon y queso.png" },
    { id: 308, codigo: "308", name: "Pebete de Salame y Queso",             desc: "Pebete en pan de viena con salame y queso",price: 3500, img: "/Comida/Sangucheria/Pebete de salame y queso.png" },
  ],
  Golosinas: [
    { id: 400, codigo: "400", name: "Alfajor Blanco",              desc: "Alfajor de chocolate blanco con dulce de leche",    price: 3500, img: "/Comida/Golosinas y galletitas/Alfajor blanco.png" },
    { id: 401, codigo: "401", name: "Alfajor Negro",               desc: "Alfajor de chocolate negro con dulce de leche",     price: 2800, img: "/Comida/Golosinas y galletitas/Alfajor negro.png" },
    { id: 402, codigo: "402", name: "Barra de Cereal",             desc: "Barra de cereal",                                   price: 3500, img: "/Comida/Golosinas y galletitas/Barra de cereal.png" },
    { id: 403, codigo: "403", name: "Turrón de Maní",              desc: "Turrón de maní",                                    price: 3500, img: "/Comida/Golosinas y galletitas/Turron de mani.png" },
    { id: 406, codigo: "406", name: "Gomitas",                     desc: "Paquete de gomitas",                                price: 3500, img: "/Comida/Golosinas y galletitas/Gomitas.png" },
    { id: 407, codigo: "407", name: "Galletitas de Agua",          desc: "Paquete de galletitas de agua",                     price: 3500, img: "/Comida/Golosinas y galletitas/Galletitas de agua.png" },
    { id: 408, codigo: "408", name: "Bizcochos de Grasa",          desc: "Paquete de bizcochos de grasa",                     price: 3500, img: "/Comida/Golosinas y galletitas/Bizcochos de grasa.png" },
    { id: 409, codigo: "409", name: "Galletitas Dulces",           desc: "Paquete de galletitas dulces",                      price: 3500, img: "/Comida/Golosinas y galletitas/Gallatetias dulces (chicas).png" },
    { id: 410, codigo: "410", name: "Galletitas Dulces (variedad)",desc: "Paquete de galletitas dulces surtidas",             price: 3500, img: "/Comida/Golosinas y galletitas/Galletitas dulces (grandes).png" },
    { id: 411, codigo: "411", name: "Paquete de Papas Fritas",     desc: "Paquete de papas fritas",                           price: 3500, img: "/Comida/Golosinas y galletitas/Papas fritas.png" },
    { id: 412, codigo: "412", name: "Galletitas Saladas",          desc: "Paquete de galletitas saladas",                     price: 3500, img: "/Comida/Golosinas y galletitas/Galletitas saladas.png" },
  ],
  GolosinasSinTACC: [
    { id: 500, codigo: "500", name: "Alfajor de Arroz Integral y Dulce de Leche", desc: "Alfajor sin TACC de arroz integral",      price: 3500, img: "/Comida/Sin tacc/Alfajor de arroz.png" },
    { id: 501, codigo: "501", name: "Alfajor de Arroz c/Yogurt de Frutilla",      desc: "Alfajor sin TACC con yogurt de frutilla",  price: 3500, img: "/Comida/Sin tacc/Alfajor de arroz (frutilla).png" },
    { id: 502, codigo: "502", name: "Galletitas Dulces - Bizcochos",              desc: "Galletitas dulces sin TACC",                price: 3500, img: "/Comida/Sin tacc/galletitas sin tacc.png" },
    { id: 503, codigo: "503", name: "Barrita Bañada en Chocolate Negro",          desc: "Barrita sin TACC bañada en chocolate",      price: 3500, img: "/Comida/Sin tacc/Barra sin tacc.png" },
    { id: 504, codigo: "504", name: "Tostadas de Arroz Sin Sal",                  desc: "Tostadas de arroz sin sal sin TACC",        price: 3500, img: "/Comida/Sin tacc/Tostadas de arroz multiceral.png" },
    { id: 505, codigo: "505", name: "Tostadas de Arroz Multisemillas",            desc: "Tostadas de arroz multisemillas sin TACC",  price: 3500, img: "/Comida/Sin tacc/Tostadas de arroz multiceral.png" },
  ],
  Menu: [
    { id: 601, codigo: "601", name: "Plato Principal",             desc: "Plato del día",                                     price: 3500, img: "/Comida/Plato principal.png" },
  ],
  Promociones: [
    { id: 800, codigo: "800", name: "Café con Leche + Medialunas c/Jamón y Queso", desc: "Combo café con leche y medialunas",    price: 3500, img: "/Comida/Promociones/Cafe y medialunas.png" },
  ],
};


// ──────────────────────────────────────────────────────────────────────────────
// Menús por recorrido — cada uno es una copia independiente del menú base.
// Editá la copia de cada recorrido para personalizar su stock.
// ──────────────────────────────────────────────────────────────────────────────

// Asigna IDs únicos. Si el item tiene `codigo` numérico lo usa como ID
// (ej: codigo "101" → id 101). Así el ID del archivo y el del runtime coinciden.
function asignarIds(menu) {
  let contador = 1000; // fallback para items sin codigo
  return Object.fromEntries(
    Object.entries(menu).map(([cat, items]) => [
      cat,
      items.map((item) => {
        const codigoNum = item.codigo ? parseInt(item.codigo, 10) : NaN;
        const id = !isNaN(codigoNum) ? codigoNum : contador++;
        return { ...item, id };
      }),
    ])
  );
}

function clonarMenu(menu) {
  return Object.fromEntries(
    Object.entries(menu).map(([cat, items]) => [
      cat,
      items.map((item) => ({ ...item })),
    ])
  );
}

// Aplicamos IDs únicos al menú base
const menuBaseConIds = asignarIds(menuBase);

export const menuByRecorrido = {
  1: clonarMenu(menuBaseConIds), // Recorrido 1 — Buenos Aires - Mar del Plata
  2: clonarMenu(menuBaseConIds), // Recorrido 2 — Buenos Aires - Pinamar
  3: clonarMenu(menuBaseConIds), // Recorrido 3 — Buenos Aires - Bragado
  4: clonarMenu(menuBaseConIds), // Recorrido 4 — Buenos Aires - Junín
  5: clonarMenu(menuBaseConIds), // Recorrido 5 — Buenos Aires - Justo Daract
  6: clonarMenu(menuBaseConIds), // Recorrido 6 — Buenos Aires - Rosario
  7: clonarMenu(menuBaseConIds), // Recorrido 7 — Buenos Aires - Córdoba
  8: clonarMenu(menuBaseConIds), // Recorrido 8 — Buenos Aires - Tucumán
};

// Exportamos también el menú base por compatibilidad
export const menuItems = menuBaseConIds;

export const timeSlots = ["En 10 minutos", "En 20 minutos", "En 30 minutos", "En 45 minutos", "En 1 hora"];
