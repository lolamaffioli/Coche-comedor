// ──────────────────────────────────────────────────────────────────────────────
// Recorridos del Coche Comedor
// ──────────────────────────────────────────────────────────────────────────────
// Campos editables por recorrido:
//   nombre      → nombre que aparece en el selector
//   descripcion → texto chico debajo del nombre
//   imagen      → ruta a la imagen del recorrido.
//                 • Podés usar una URL externa: "https://..."
//                 • O podés poner tus propias fotos en la carpeta
//                   public/recorridos/ y referenciarlas así: "/recorridos/mi-foto.jpg"
// ──────────────────────────────────────────────────────────────────────────────

const LOGO_TREN = "/recorridos/logo-tren-recorridos.png";

export const recorridos = [
  {
    id: 1,
    nombre: "Buenos Aires - Mar del Plata",
    descripcion: "Ramal 1",
    imagen: LOGO_TREN,
  },
  {
    id: 2,
    nombre: "Buenos Aires - Gral. Guido - Divisadero de Pinamar",
    descripcion: "Ramal 2",
    imagen: LOGO_TREN,
  },
  {
    id: 3,
    nombre: "Buenos Aires - Bragado",
    descripcion: "Ramal 3",
    imagen: LOGO_TREN,
  },
  {
    id: 4,
    nombre: "Buenos Aires - Junín",
    descripcion: "Ramal 4",
    imagen: LOGO_TREN,
  },
  {
    id: 5,
    nombre: "Buenos Aires - Justo Daract",
    descripcion: "Ramal 5",
    imagen: LOGO_TREN,
  },
  {
    id: 6,
    nombre: "Buenos Aires - Rosario",
    descripcion: "Ramal 6",
    imagen: LOGO_TREN,
  },
  {
    id: 7,
    nombre: "Buenos Aires - Córdoba",
    descripcion: "Ramal 7",
    imagen: LOGO_TREN,
  },
  {
    id: 8,
    nombre: "Buenos Aires - Tucumán",
    descripcion: "Ramal 8",
    imagen: LOGO_TREN,
  },
];
